export interface DesignStyle {
  id: number;
  name: string;
  nameEn: string;
  description: string;
}

export const designStyles: DesignStyle[] = [
  { id: 1, name: '심플', nameEn: 'Simple', description: '깔끔한 여백과 최소한의 요소로 핵심 메시지 전달' },
  { id: 2, name: '공학적', nameEn: 'Engineering', description: '구조적이고 정밀한 다이어그램 중심 레이아웃' },
  { id: 3, name: '과학적', nameEn: 'Scientific', description: '데이터 시각화와 분석적 그래프 중심 디자인' },
  { id: 4, name: '예술적', nameEn: 'Artistic', description: '회화적 표현과 감성적 비주얼이 강조된 디자인' },
  { id: 5, name: '창의적', nameEn: 'Creative', description: '비대칭 레이아웃과 실험적 타이포그래피 활용' },
  { id: 6, name: '미니멀', nameEn: 'Minimal', description: '극단적으로 절제된 요소와 풍부한 여백' },
  { id: 7, name: '모던', nameEn: 'Modern', description: '세련된 기하학적 형태와 그라디언트 활용' },
  { id: 8, name: '클래식', nameEn: 'Classic', description: '전통적이고 격식 있는 레이아웃과 세리프 서체' },
  { id: 9, name: '테크', nameEn: 'Tech', description: '디지털 감성의 네온 톤과 그리드 기반 레이아웃' },
  { id: 10, name: '비즈니스', nameEn: 'Business', description: '기업 프레젠테이션에 적합한 전문적 레이아웃' },
  { id: 11, name: '인포그래픽', nameEn: 'Infographic', description: '정보 시각화에 최적화된 아이콘/차트 중심' },
  { id: 12, name: '매거진', nameEn: 'Magazine', description: '잡지 편집 스타일의 이미지와 텍스트 조합' },
  { id: 13, name: '다크모드', nameEn: 'Dark Mode', description: '어두운 배경에 하이 콘트라스트 텍스트 강조' },
  { id: 14, name: '그라디언트', nameEn: 'Gradient', description: '부드러운 색상 전환과 글래스모피즘 효과' },
  { id: 15, name: '3D/입체', nameEn: '3D/Dimensional', description: '3D 오브젝트와 원근감이 느껴지는 레이아웃' },
  { id: 16, name: '플랫', nameEn: 'Flat', description: '평면적 색면과 단순한 도형 기반 디자인' },
  { id: 17, name: '뉴모피즘', nameEn: 'Neumorphism', description: '부드러운 그림자와 양각/음각 효과' },
  { id: 18, name: '레트로', nameEn: 'Retro', description: '복고풍 컬러팔레트와 빈티지 타이포그래피' },
  { id: 19, name: '미래적', nameEn: 'Futuristic', description: 'SF 감성의 홀로그램과 사이버펑크 요소' },
  { id: 20, name: '자연/유기적', nameEn: 'Organic', description: '자연 텍스처와 유기적 곡선 형태 활용' },
  { id: 21, name: '기하학적', nameEn: 'Geometric', description: '정교한 기하학 패턴과 구조적 그리드' },
  { id: 22, name: '타이포중심', nameEn: 'Typography-centric', description: '대형 타이포그래피가 주인공인 디자인' },
  { id: 23, name: '사진중심', nameEn: 'Photo-driven', description: '대형 이미지와 풀블리드 사진 중심 레이아웃' },
  { id: 24, name: '일러스트', nameEn: 'Illustration', description: '커스텀 일러스트레이션 기반 스토리텔링' },
  { id: 25, name: '데이터중심', nameEn: 'Data-driven', description: '차트, 그래프, 대시보드 스타일 데이터 시각화' },
  { id: 26, name: '스토리텔링', nameEn: 'Storytelling', description: '내러티브 흐름이 강조된 연속적 시각 전개' },
  { id: 27, name: '브루탈리즘', nameEn: 'Brutalism', description: '거친 텍스처와 굵은 선, 실험적 레이아웃' },
  { id: 28, name: '글래스모피즘', nameEn: 'Glassmorphism', description: '반투명 유리 효과와 배경 블러' },
  { id: 29, name: '한국적', nameEn: 'Korean Traditional', description: '한국 전통 문양과 색동 컬러 활용' },
  { id: 30, name: '하이브리드', nameEn: 'Hybrid', description: '여러 스타일을 혼합한 자유로운 구성' },
];
