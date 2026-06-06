-- STEP 12 테스트 데이터
insert into projects (id, project_title, design_type, status) values
(gen_random_uuid(), 'PPT 샘플 프로젝트', '프레젠테이션 디자인(PPT)', 'manager_review'),
(gen_random_uuid(), '편집 샘플 프로젝트', '편집 디자인', 'manager_review'),
(gen_random_uuid(), '브랜딩 샘플 프로젝트', '브랜딩 디자인', 'manager_review'),
(gen_random_uuid(), '상세페이지 샘플 프로젝트', '상세페이지 디자인', 'manager_review');
