import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { ko } from 'date-fns/esm/locale';
import { auth, db } from '../firebase';
import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';

const Wrapper = styled.div`
  display: flex;
  margin: 30px;
  margin-bottom: 180px;
  /* align-items: center; */
  /* flex-direction: row; */
  /* justify-content: space-between; */
  gap: 20px;
  /* height: 100vh; */
  overflow-y: scroll;
`;

const Form = styled.form`
  margin-top: 30px;
  /* margin-bottom: 10px; */
  /* display: flex; */
  /* flex-direction: column;
  gap: 10px;
  width: 100%; */
`;
const Contents = styled.div`
  width: 400px;
`;
const Content = styled.div`
  div {
    font-weight: 600;
    margin: 15px;
    font-size: 20px;
  }
  #date {
    display: none;
  }
  button {
    cursor: pointer;
    height: 50px;
    border-radius: 10px;
    background-color: #efefef;
    border: 1px solid #393939;
    color: #585858;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .company-button {
    display: flex;
    align-items: center;
    flex-direction: row;

    span {
      margin-right: 15px;
    }
    button {
      width: 70px;
      height: 30px;
      font-size: 15px;
      border: 0;

      /* display: flex; */
      align-items: center;
      margin: 0;
      margin-right: 5px;
    }
  }
  .dot div:nth-child(2) {
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    /* flex-direction: row; */
    text-align: center;
    padding: 0;
    margin: 0;
  }
  .dot div.react-calendar__viewContainer {
    display: flex;
    width: 100%;
    justify-content: center;
    /* align-items: center; */
    /* flex-direction: row; */
    /* /* text-align: center; */
  }
  .dot div.react-calendar__month-view__weekdays {
    display: flex;
    width: 70%;
    /* justify-content: center; */
    align-items: center;
    /* flex-direction: row; */
    /* text-align: center; */
    /* margin: 10;
    padding: 10; */
  }
`;
const BottomSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff6f6;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  div {
    padding: 8px;
    width: 80%;
    display: flex;
    justify-content: space-between;
  }
  div:nth-child(3) span {
    font-size: 20px;
    font-weight: 600;
  }
  button {
    width: 80%;
  }
`;

const Label = styled.div`
  cursor: pointer;
  height: 50px;
  border-radius: 10px;
  background-color: #93e4ff;

  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 30px;
    margin-right: 5px;
  }
  span {
    font-weight: 600;
  }
`;

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface IPrice {
  price: number;
}

export interface ICompany {
  companyName: string;
  companyNumber: string;
  ceo: string;
  companyAddress: string;
  mainField: string;
  subField: string;
  id?: string;
}

export default function Estimate() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Value>();
  const [title, setTitle] = useState<string | undefined>('');
  const [receiver, setReceiver] = useState<string | undefined>('');
  const [price, setPrice] = useState<IPrice>();
  const [selected, setSelected] = useState<string | undefined>();
  const [total, setTotal] = useState<number | undefined>();
  const [note, setNote] = useState<string | undefined>('');
  const [companyInfo, setCompanyInfo] = useState<ICompany>();

  const toggleCalendar = () => {
    setCalendarDate(new Date());
    setVisible(!visible);
  };
  const onDateChange = (value: Value) => {
    console.log('date value', value);
    if (value instanceof Date) {
      setCalendarDate(value);
    }
    setVisible(!visible);
  };
  const onTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setTitle(value);
  };
  const onReceiver = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setReceiver(value);
  };
  const onNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setNote(value);
  };

  const priceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;

    setPrice({ price: parseFloat(value) });
  };

  const onSelected = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    if (!price) {
      return;
    }

    if (selected == 'added') {
      setTotal(price.price * 1.1);
    } else if (selected == 'noAdded') {
      setTotal(price.price);
    }
  }, [selected, price, total]);

  const fetchCompanyInfo = async () => {
    const user = auth.currentUser;
    const companyQuery = query(
      collection(db, 'userCompany'),
      where('userId', '==', user?.uid),
      limit(5)
    );
    const snapshot = await getDocs(companyQuery);
    const companyInfo = snapshot.docs.map((doc) => {
      const {
        companyName,
        companyNumber,
        ceo,
        companyAddress,
        mainField,
        subField,
      } = doc.data();
      return {
        companyName,
        companyNumber,
        ceo,
        companyAddress,
        mainField,
        subField,
        id: doc.id,
      };
    });
    setCompanyInfo(companyInfo[0]);
  };
  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const onReviseCompany = () => {
    navigate('/owner');
    fetchCompanyInfo();
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading) {
      return;
    }
    try {
      setLoading(true);

      const data = await addDoc(collection(db, 'estimate'), {
        createdAt: Date.now(),
        username: user.displayName || 'Anonymous',
        userId: user.uid,
        title: title,
        receiver: receiver,
        estimateDate: moment(calendarDate as Date).format('YYYY년 MM월 DD일'),
        price: price?.price,
        additionalTax: selected === 'added' ? '부가세 10%' : '부가세 없음',
        total: total,
        note: note,
        companyInfo: companyInfo,
      });
      console.log(data);

      setTitle('');
      setReceiver('');
      setNote('');
      setSelected('');
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      navigate('/');
    }
  };

  return (
    <Wrapper>
      <link
        rel="stylesheet"
        href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css"
      />
      <Form onSubmit={onSubmit}>
        <Contents>
          <Content>
            <div>견적서 제목</div>
            <input
              required
              placeholder="예) 10월 10일 A업체"
              value={title}
              onChange={onTitle}
            />
            <div>받는 사람</div>
            <input
              required
              placeholder="예) 김ㅇㅇ사장님"
              value={receiver}
              onChange={onReceiver}
            />
            <div>공급가</div>
            <input
              required
              placeholder="10,000"
              type="number"
              value={price ? price.price : ''}
              onChange={priceChange}
            />
            <div>부가세</div>
            <select required onChange={onSelected}>
              <option>선택하기</option>
              <option value="added">부가세 추가(10%)</option>
              <option value="noAdded">부가세 없음</option>
            </select>

            <Label onClick={toggleCalendar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6">
                <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                <path
                  fillRule="evenodd"
                  d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {!calendarDate
                  ? '견적 일자'
                  : moment(calendarDate as Date).format('YYYY년 MM월 DD일')}
              </span>
            </Label>
            {visible ? (
              <Calendar
                // formatDay={(date) => moment(date).format('DD')}
                locale="ko"
                showNeighboringMonth={false}
                className="dot"
                value={calendarDate as Date}
                onChange={onDateChange}
              />
            ) : null}
            {/* {calendarDate ? calendarDate : null} */}
            <div>비고</div>
            <input
              placeholder="참고사항을 작성해주세요"
              value={note}
              onChange={onNote}
            />
          </Content>
          <Content>
            {companyInfo ? (
              <>
                <div className="company-button">
                  <span>사업자 정보</span>
                  <button onClick={onReviseCompany}>수정</button>
                </div>
                <table>
                  <tbody>
                    <tr>
                      <td>회사명</td>
                      <td>{companyInfo?.companyName}</td>
                    </tr>
                    <tr>
                      <td>사업자등록증</td>
                      <td>{companyInfo?.companyNumber}</td>
                    </tr>
                    <tr>
                      <td>대표자명</td>
                      <td>{companyInfo?.ceo}</td>
                    </tr>
                    <tr>
                      <td>사업장 주소</td>
                      <td>{companyInfo?.companyAddress}</td>
                    </tr>
                    <tr>
                      <td>업태</td>
                      <td>{companyInfo?.mainField}</td>
                    </tr>
                    <tr>
                      <td>업종</td>
                      <td>{companyInfo?.subField}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            ) : (
              <Link to="/owner">
                <div>사업자 정보</div>
                <button> + 불러오기</button>
              </Link>
            )}
          </Content>
        </Contents>
        <BottomSheet>
          <div>
            <span>공급가액</span>
            <span>{price ? `${price.price}원` : `원`}</span>
          </div>
          <div>
            <span>부가세(10%)</span>
            <span>
              {selected == 'added'
                ? price != undefined
                  ? `${(price.price * 0.1).toFixed(0)}원`
                  : `원`
                : price != undefined
                ? `0원`
                : `원`}
            </span>
          </div>
          <div>
            <span>합계</span>
            <span>
              {selected == 'added'
                ? total != undefined
                  ? `${total.toLocaleString()}원`
                  : `원`
                : total != undefined
                ? `${total.toLocaleString()}원`
                : `원`}
            </span>
          </div>
          <button type="submit">{isLoading ? '저장 중' : '작성 완료'}</button>
        </BottomSheet>
      </Form>
    </Wrapper>
  );
}
