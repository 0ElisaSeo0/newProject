import styled from 'styled-components';
import { Title } from '../components/auth-components';
import { auth, db } from '../firebase';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const Documents = styled.div`
  display: flex;
  /* width: 100%; */
  flex-direction: column;
  font-weight: 600;
  /* justify-content: space-between; */
`;
const Table = styled.table`
  div {
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    /* margin: 10px; */
    table {
      margin: 20px 0px;
    }
  }
  /* border: 1px solid #ccc; */
  /* border-radius: 5px; */
  /* padding: 10px; */
  /* background-color: #f7f7f7; */
  margin: 10px;
  table {
    /* width: 100%; */
    /* border-collapse: collapse; */

    tr {
      border-bottom: 1px solid #ccc;
      padding: 5px 0;
    }

    td {
      padding: 10px;
    }
  }
`;

export default function Document() {
  const [estimate, setEstimate] = useState();
  const fetchData = async () => {
    const user = auth.currentUser;
    const estimateQuery = query(
      collection(db, 'estimate'),
      where('userId', '==', user?.uid),
      limit(25)
    );
    console.log(user);
    const snapshot = await getDocs(estimateQuery);
    const estimate = snapshot.docs.map((doc) => {
      const {
        title,
        receiver,
        companyInfo,
        estimateDate,
        note,
        price,
        additionalTax,
        total,
      } = doc.data();
      return {
        title,
        receiver,
        companyInfo,
        estimateDate,
        note,
        price,
        additionalTax,
        total,
        id: doc.id,
      };
    });
    // console.log(companyInfo[0]);
    setEstimate(estimate[0]);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Wrapper>
      <Title>견적서</Title>
      <Documents>
        <Table className="firstTable">
          <div>
            <table>
              <tbody>
                <tr>
                  <td>수신</td>
                  <td>내용</td>
                </tr>
                <tr>
                  <td>견적명</td>
                  <td>내용</td>
                </tr>
                <tr>
                  <td>견적날짜</td>
                  <td>내용</td>
                </tr>
                <tr>
                  <td>유효기간</td>
                  <td>견적일로부터 1주일</td>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
                <tr>
                  <td>상호명</td>
                  <td>내용</td>
                  <td>대표</td>
                  <td>내용</td>
                </tr>
                <tr>
                  <td>사업자번호</td>
                  <td>내용</td>
                </tr>
                <tr>
                  <td>주소</td>
                  <td>내용</td>
                </tr>
                <tr>
                  <td>이메일</td>
                  <td>내용</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Table>
        <Table className="thirdTable">
          <table>
            <tbody>
              <tr>
                <td>견적금액</td>
                <td>일금 ㅇㅇㅇ원 (부가세포함)</td>
              </tr>
            </tbody>
          </table>
        </Table>
        <Table>
          <table>
            <thead>
              <tr>
                <td>항목</td>
                <td>세부내용</td>
                <td>수량</td>
                <td>단가</td>
                <td>금액</td>
                <td>세액</td>
              </tr>
            </thead>
          </table>
        </Table>
      </Documents>
    </Wrapper>
  );
}
