import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div``;

// const Title = styled.h1`
//   text-align: center;
//   font-weight: 500;
//   font-size: 30px;
//   font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
//     Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
// `;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* margin-top: 10px; */
  span {
    font-size: 30px;
    font-weight: 600;
    padding: 15px;
  }
  svg {
    &.image1 {
      width: 37px;
      fill: tomato;
    }
    &.image2 {
      width: 27px;
      fill: #4753ff;
    }
    &.image3 {
      width: 27px;
      fill: #ff4775;
    }
  }

  p {
    padding: 15px;
    font-size: 17px;
    padding-top: 20px;
  }
  .container {
    background-color: #f2f2f2c7;
    border-radius: 15px;
    width: 80%;
    display: flex;
    align-items: center;
    flex-direction: column;
    div {
      font-size: 30px;
      font-weight: 600;
      margin: 10px 45px;
    }
  }
`;

const Content = styled.div`
  padding: 20px 10px 10px 10px;

  &.estimate {
    padding-bottom: 20px;
    border: 3px solid #ffe8e8;
    background-color: white;

    border-radius: 10px;
    margin: 5px 0px;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      text-decoration: none;
    }
    span {
      font-size: 20px;
    }
    svg {
      width: 50px;
    }
  }
`;

export default function Home() {
  return (
    <Wrapper>
      {/* <Title>거래를 간편하게!</Title> */}
      <Contents>
        {/* <Content>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6">
            <path
              fillRule="evenodd"
              d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 001.28.53l4.184-4.183a.39.39 0 01.266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0012 2.25zM8.25 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zm2.625 1.125a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
              clipRule="evenodd"
            />
          </svg>
          <span>매번 전화로 예약 받기 불편했다면?</span>
          <p>가능한 일정을 미리 체크해놓고 캘린더로 관리하세요.</p>
        </Content>
        <br />
        <br /> */}
        <Content>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 image1">
            <path
              fillRule="evenodd"
              d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z"
              clipRule="evenodd"
            />
            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
          </svg>
          <span>
            수기로 작성한 <br />
            문서 관리가 어려웠다면?
          </span>
          <p>
            거래 서류 작성에서부터 <br />
            수금까지 한 번에 처리하세요!
          </p>
        </Content>
        <Content className="container">
          <div>서류 작성</div>

          <Content className="estimate">
            <Link to="/estimate">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 image2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"
                />
              </svg>
              <span>견적서 작성</span>
            </Link>
          </Content>
        </Content>
        <br />
        <br />
        <Content className="container document">
          <div>서류함</div>

          <Content className="estimate">
            <Link to="/documents">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 image3">
                <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
              </svg>

              <span>견적서 확인</span>
            </Link>
          </Content>
        </Content>
      </Contents>
    </Wrapper>
  );
}
