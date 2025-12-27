# ⚡ Time-Deal Concurrency Control Project
> 선착순 이벤트 시스템에서 발생하는 **동시성 이슈(Race Condition)**를 재현하고,
> 다양한 락(Lock) 전략을 적용하여 **데이터 정합성**을 보장하는 과정을 기록한 프로젝트입니다.

## 🎯 Project Goal
- 고트래픽 상황(100명 동시 접속)에서의 **재고 초과 판매(Overselling)** 현상 분석
- **Pessimistic Lock**, **Optimistic Lock** 등을 적용해보며 성능과 안정성 비교
- **k6**를 활용한 부하 테스트 및 시나리오 검증

## 🧪 Scenario & Issue Reproduction (문제 재현)
### 테스트 환경
- **Initial Stock:** 10 EA
- **Virtual Users:** 100 VU (Concurrent Requests)
- **Test Tool:** k6

### 결과 (Without Lock)
동시성 제어가 없는 상태에서 테스트를 진행한 결과, **100건의 주문이 모두 성공**하는 심각한 데이터 불일치 발생.

| 구분 | 결과 | 비고 |
|:---:|:---:|:---|
| k6 Success Rate | **100%** (100/100) | 90건은 실패해야 정상 |
| DB Inventory | 3 | - |
| DB Orders | **100** | **90건 초과 판매 발생** |

<img width="649" height="28" alt="스크린샷 2025-12-27 오후 4 13 32" src="https://github.com/user-attachments/assets/35b55b9c-8aa9-4310-938e-d2842ae7ce73" />
<img width="533" height="82" alt="스크린샷 2025-12-27 오후 4 13 43" src="https://github.com/user-attachments/assets/557e0430-d5b8-4f84-a6aa-97e253bc58e4" />
<img width="533" height="54" alt="스크린샷 2025-12-27 오후 4 34 02" src="https://github.com/user-attachments/assets/65557e85-86e2-4494-85eb-0cfcb44cd777" />

## 🛠 Solutions (해결 전략)
### 1. Pessimistic Lock (비관적 락) 도입
