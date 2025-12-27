let fetchedProduct = null;
let productOptions = [];

let selectedState = {
    productId: null,
    productName: '',
    color: null,
    size: null
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        alert('잘못된 접근입니다. URL에 상품 ID가 없습니다.');
        return;
    }
    fetchProductData(productId);
});

async function fetchProductData(id) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/product/${id}`);

        if (!response.ok) {
            throw new Error(`API 오류 : ${response.status}`);
        }

        const data = await response.json();

        console.log("백엔드에서 받은 데이터:", data);
        fetchedProduct = data;
        productOptions = data.options;

        selectedState.productId = data.id;
        selectedState.productName = data.name;

        renderBasicInfo();
        renderColorOptions();
    } catch (error) {
        console.error('데이터 로딩 실패:', error);
        // alert(`상품 정보를 불러올 수 없습니다. (백엔드 서버가 켜져있는지 확인하세요)`);
    }
}

function renderBasicInfo() {
    if (!fetchedProduct) return;

    document.getElementById('productName').textContent = fetchedProduct.name;
    document.getElementById('productPrice').textContent = `₩${fetchedProduct.price.toLocaleString()}`;

    const imgUrl = fetchedProduct.image || fetchedProduct.imageUrl || '';
    document.getElementById('productImg').src = imgUrl;

    const badge = document.getElementById('dealBadge');
    if (badge) {
        badge.style.display = 'inline-block';
    }

    const buyBtn = document.getElementById('buyBtn');
    buyBtn.onclick = requestOrder;
}

function renderColorOptions() {
    const container = document.getElementById('color-options');

    if (!container) return;

    container.innerHTML = '';

    const uniqueColors = [...new Set(productOptions.map(opt => opt.color))];

    if (uniqueColors.length === 0) {
        container.innerHTML = '<span>옵션 없음</span>';
        return;
    }

    uniqueColors.forEach((color, index) => {
        const btn = document.createElement('button');
        btn.className = 'chip';
        btn.textContent = color;
        btn.dataset.value = color;

        if (index === 0) selectColor(color, btn);

        btn.onclick = () => selectColor(color, btn);
        container.appendChild(btn);
    });
}

function renderSizeOptions(selectedColor) {
    const container = document.getElementById('size-options');
    if (!container) return;

    container.innerHTML = '';

    const filteredOptions = productOptions.filter(opt => opt.color === selectedColor);
    filteredOptions.sort((a, b) => a.size.localeCompare(b.size));

    console.log(`=== [${selectedColor}] 사이즈 옵션 데이터 ===`);

    filteredOptions.forEach(opt => {
        const btn = document.createElement('button');

        const stockCount = opt.stock !== undefined ? opt.stock : 0;
        const isSoldOut = stockCount <= 0;


        btn.className = `chip ${isSoldOut ? 'disabled' : ''}`;
        btn.disabled = isSoldOut;
        btn.dataset.value = opt.size;

        const stockValue = isSoldOut ? '(품절)' : `(재고:${stockCount})`;
        btn.innerHTML = `${opt.size} <span class="stock-info">${stockValue}</span>`;

        if (!isSoldOut) {
            btn.onclick = () => selectSize(opt.size, btn);
        }
        container.appendChild(btn);
    });
}

function selectColor(color, btnElement) {
    selectedState.color = color;
    selectedState.size = null;

    const container = document.getElementById('color-options');
    Array.from(container.children).forEach(c => c.classList.remove('selected'));
    btnElement.classList.add('selected');

    renderSizeOptions(color);
}

function selectSize(size, btnElement) {
    selectedState.size = size;

    const container = document.getElementById('size-options');
    Array.from(container.children).forEach(c => c.classList.remove('selected'));
    btnElement.classList.add('selected');

    console.log(`선택: ${selectedState.color} / ${size}`);
}

async function requestOrder() {
    if (!selectedState.color || !selectedState.size) {
        alert('색상과 사이즈를 선택해주세요.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:3000/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: Number(selectedState.productId),
                color: selectedState.color,
                size: selectedState.size
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || '주문 성공!');
            window.location.reload();
        } else {
            alert('주문 실패: ' + (result.message || '오류'));
        }

    } catch (e) {
        console.error(e);
        alert('서버 통신 오류');
    }
}