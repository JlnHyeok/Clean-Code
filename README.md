## 2주차 Clean Code STEP 3. 테이블 설명

### ERD
<img width="683" alt="image" src="https://github.com/user-attachments/assets/ac10d56f-6228-417c-8b87-ac2dc0ba75fd">


### 설계 선택 이유
1. 다대다 관계:
Student와 Lecture 엔티티는 다대다 관계를 가지고 있습니다. 즉, 한 학생은 여러 강의에 등록할 수 있고, 각 강의는 여러 학생에 의해 등록될 수 있습니다. 이는 LectureRegistration 조인 테이블을 통해 구현되며, 이 테이블은 Student와 Lecture 테이블의 외래 키를 포함.

2. 조인 테이블 (LectureRegistration):
LectureRegistration 모델은 학생과 강의 간의 관계를 캡처하는 조인 테이블 역할을 합니다. 이 테이블은 각각의 기본 키를 참조하는 외래 키(studentId, lectureId)를 포함하고 있습니다. 이 설계는 어떤 학생이 어떤 강의에 등록되어 있는지를 추적할 수 있게 하며, 참조 무결성을 유지.

3. 유일 제약 조건:
LectureRegistration 모델의 studentId와 lectureId 조합에 대한 유일 제약 조건은 학생이 동일한 강의에 여러 번 등록할 수 없도록 보장합니다. 이는 등록 프로세스의 무결성을 유지.

4. 속성:
- Lecture: 이 모델에는 강의의 필수 정보를 담고 있는 title, tutor, createdAt, capacity, currentStudents 등의 필드가 포함되어 있습니다. currentStudents 필드는 현재 강의에 등록된 학생 수를 추적하여 최대 수용 인원과의 비교를 쉽게 할 수 있도록 합니다.
- Student: 이 모델은 학생을 식별하는 데 필요한 기본 속성인 id와 name 필드를 가진 간단한 구조로 되어 있습니다.

