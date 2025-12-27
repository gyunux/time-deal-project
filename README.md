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

동시성 문제를 해결하기 위해, 데이터베이스 레벨에서 강력한 잠금을 거는 **비관적 락(Pessimistic Lock)** 방식을 선택했습니다.

TypeORM의 `QueryRunner`를 활용하여 수동으로 트랙잭션을 제어하고, 재고를 조회하는 시점에 `X-Lock(배타적 잠금)`을 걸어 다른 트랜잭션이 접근하지 못하도록 막았습니다.

> **핵심 구현(NestJS + TypeORM)**
> ```typescript
> //트랜잭션 시작
> await queryRunner.startTransaction();
>
> //핵심: 조회 시점에 Lock을 건다(SELECT ... FOR UPDATE)
> const option = await queryRunner.manager.findOne(ProductOption, {
>   where: {...},
>   lock: {mode: 'pessimistic_write'},
> });
> // ... (재고 검증 및 차감 로직) ...
>
> //커밋(Lock 해제)
> await queryRunner.commitTransaction();
>
### 테스트 결과(With Pessimistic Lock)
비관적 락을 적용한 후, 동일한 조건(초기 재고 10개, 100명 동시 요청)으로 부하테스트 재진행

| 구분 | 결과 | 비고 |
|:---:|:---:|:---|
| k6 Success Rate | **10%** (10/100) | 재고 수량만큼만 성공 (정상) |
| DB Inventory | 0 | 정상 소진 |
| DB Orders | **10** | **초과 판매(Overselling) 문제 해결됨** |

<br>

**[증거 1] k6 부하 테스트 결과 (총 100건 요청)**
> 총 100건의 HTTP 요청이 발생했습니다.
<img width="657" height="26" alt="스크린샷 2025-12-27 오후 6 33 41" src="https://github.com/user-attachments/assets/f0b6acb6-24a6-489a-9841-35c98b81116b" />
<br>

**[증거 2] k6 부하 테스트 성공/실패율**
> 100건 중 **10건(10%)만 성공**하고, 나머지 **90건(90%)은 실패** 처리되었습니다. 재고가 0이 된 시점부터는 정상적으로 요청을 거절했음을 의미합니다.
<img width="506" height="153" alt="스크린샷 2025-12-27 오후 6 33 36" src="https://github.com/user-attachments/assets/9a9a25ec-3705-49b2-900d-711054eef08a" />
<br>

**[증거 3] 데이터베이스 최종 상태 검증**
> 초기 재고를 10개로 설정했을 때, 성공한 주문 수가 정확히 **10개**이며, **초과 판매량이 0**인 것을 확인했습니다. 데이터 무결성이 완벽하게 지켜졌습니다.
 <img width="406" height="52" alt="스크린샷 2025-12-27 오후 6 33 52" src="https://github.com/user-attachments/assets/333fa3e2-310c-417d-a283-eefc9be1b6dc" />
 <br>
