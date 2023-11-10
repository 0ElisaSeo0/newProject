import { createWorker, Logger, LoggerEvent } from 'tesseract.js';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ref } from 'firebase/storage';
import { ICompany } from './estimate';

// const Owner: React.FC = () => {
//   const runOCR = async () => {
//     const worker = await createWorker('kor', 1, {
//       logger: (m: LoggerEvent) => console.log(m),
//       //   workerPath: '/path/to/tesseract.js/worker',
//       //   corePath: '/path/to/tesseract.js/core',
//     });

//     try {
//       //   await worker.load();
//       //   await worker.loadLanguage('kor');
//       //   await worker.initialize('kor');
//       //   const logger = (event: LoggerEvent) => console.log(event.data);
//       //   await worker.setLogger(logger);
//       const { data } = await worker.recognize('./첨부자료.png', 'kor');
//       console.log(data.text);
//     } catch (error) {
//       console.error('Error during OCR:', error);
//     } finally {
//       if (worker.terminate) {
//         await worker.terminate();
//       }
//     }
//   };
//   useEffect(() => {
//     runOCR();
//   });

//   return <div>hello</div>;
// };

// export default Owner;

const Wrapper = styled.div`
  display: flex;
  /* margin: 20px; */
  flex-direction: column;
  justify-content: space-around;
  span:nth-child(1) {
    text-align: center;
    font-weight: 600;
    font-size: 30px;
  }
  span:nth-child(2) {
    text-align: center;
    font-weight: 600;
    color: #d52121;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  div {
    font-weight: 600;
    font-size: 17px;
    margin: 10px;
  }
  input {
    height: 30px;
    font-weight: 600;
    font-size: 17px;
  }
`;

const Button = styled.input`
  cursor: pointer;
  height: 50px;
  border-radius: 10px;
  border: 0;
  font-size: 20px;
  font-weight: 600;
  background-color: #1095c1;
  color: white;
`;

export default function Owner() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [company, setCompany] = useState('');
  const [comNumber, setComNumber] = useState('');
  const [ceo, setCeo] = useState('');
  const [address, setAddress] = useState('');
  const [mainField, setMainField] = useState('');
  const [subField, setSubField] = useState('');
  const [companyInfo, setCompanyInfo] = useState<ICompany>();

  const onCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany(e.target.value);
  };
  const onComNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComNumber(e.target.value);
  };
  const onCeo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCeo(e.target.value);
  };
  const onAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };
  const onMainField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainField(e.target.value);
  };
  const onSubField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubField(e.target.value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading) {
      return;
    }
    try {
      setLoading(true);
      console.log(user);

      if (companyInfo == undefined) {
        await addDoc(collection(db, 'userCompany'), {
          createdAt: Date.now(),
          username: user.displayName || 'Anonymous',
          userId: user.uid,
          companyName: company,
          companyNumber: comNumber,
          ceo: ceo,
          companyAddress: address,
          mainField: mainField,
          subField: subField,
        });

        setCompany('');
        setComNumber('');
        setCeo('');
        setAddress('');
        setMainField('');
        setSubField('');
      } else if (companyInfo && companyInfo.id) {
        const id = companyInfo.id;
        const prevData = doc(db, 'userCompany', id);
        const updatedData: {
          companyName: string;
          companyNumber: string;
          ceo: string;
          companyAddress: string;
          mainField: string;
          subField: string;
          updatedAt: number;
        } = {
          companyName: company,
          companyNumber: comNumber,
          ceo: ceo,
          companyAddress: address,
          mainField: mainField,
          subField: subField,
          updatedAt: Date.now(),
        };
        await updateDoc(prevData, updatedData);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      navigate('/estimate');
      console.log('final', user);
    }
  };

  const fetchData = async () => {
    const user = auth.currentUser;
    const companyQuery = query(
      collection(db, 'userCompany'),
      where('userId', '==', user?.uid),
      limit(25)
    );
    console.log(user);
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
    // console.log(companyInfo[0]);
    setCompanyInfo(companyInfo[0]);
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    console.log(companyInfo);
    if (companyInfo) {
      setCompany(companyInfo?.companyName);
      setComNumber(companyInfo?.companyNumber);
      setCeo(companyInfo?.ceo);
      setAddress(companyInfo?.companyAddress);
      setMainField(companyInfo?.mainField);
      setSubField(companyInfo?.subField);
    }
  }, [companyInfo]);
  return (
    <Wrapper>
      <Form onSubmit={onSubmit}>
        <span>사업자 등록</span>
        <span>모든 항목 필수입니다</span>
        <Content>
          <div>상호명</div>
          <input required value={company} onChange={onCompany} />
        </Content>
        <Content>
          <div>사업자 등록번호</div>
          <input required value={comNumber} onChange={onComNumber} />
        </Content>
        <Content>
          <div>대표자명</div>
          <input required value={ceo} onChange={onCeo} />
        </Content>
        <Content>
          <div>사업장 주소</div>
          <input required value={address} onChange={onAddress} />
        </Content>
        <Content>
          <div>업태</div>
          <input required value={mainField} onChange={onMainField} />
        </Content>
        <Content>
          <div>종목</div>
          <input required value={subField} onChange={onSubField} />
        </Content>
        <Button type="submit" value={isLoading ? '업로드 중' : '저장하기'} />
      </Form>
    </Wrapper>
  );
}
