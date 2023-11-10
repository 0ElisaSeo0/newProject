import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import {
  Title,
  Wrapper,
  Form,
  Input,
  Error,
  Switcher,
} from '../components/auth-components';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError('');
    e.preventDefault();
    if (isLoading || email === '' || password === '') {
      return;
    }
    try {
      //create an account
      //set the name of the user
      // redirect to the home page
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/search');
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.code);
        if (e.code === 'auth/invalid-email') {
          setError('이메일이 잘못되었습니다');
        } else if (
          e.code === ('auth/wrong-password' || 'auth/invalid-login-credentials')
        ) {
          setError('비밀번호가 잘못되었습니다. 다시 입력해주세요.');
        }
      }
    } finally {
      setLoading(false);
    }

    console.log(email, password);
  };
  return (
    <Wrapper>
      <Title>로그인하기</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="email을 적어주세요"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="비밀번호를 적어주세요"
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? '로그인 중...' : '로그인하기'}
        />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        회원가입을 안 하셨나요?{' '}
        <Link to="/create-account">
          {' '}
          <br />
          <br /> &rarr; 회원가입하기
        </Link>
      </Switcher>
    </Wrapper>
  );
}
