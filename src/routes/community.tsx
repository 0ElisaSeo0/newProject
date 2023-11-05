import styled from 'styled-components';
import PostTweetForm from '../components/post-tweet-form';
import Timeline from '../components/timeline';

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  /* overflow-y: scroll; // posttweetform은 고정 상태로 스크롤 가능 */
  grid-template-rows: 1fr 5fr;
  height: 100%;
`;

export default function Community() {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}
