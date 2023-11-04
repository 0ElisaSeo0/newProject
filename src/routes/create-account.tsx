import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError('');
    e.preventDefault();
    if (isLoading || name === '' || email === '' || password === '') {
      return;
    }
    try {
      //create an account
      //set the name of the user
      // redirect to the home page
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user);
      await updateProfile(credentials.user, {
        displayName: name,
      });
      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.code);
        if (e.code === 'auth/invalid-email') {
          setError('이메일이 잘못되었습니다');
        } else if (e.code === 'auth/email-already-in-use') {
          setError('이미 회원입니다');
          alert('이미 회원가입하셨습니다');
          navigate('/login');
        } else if (e.code === 'auth/weak-password') {
          setError('비밀번호 에러');
          alert('비밀번호가 보안에 취약합니다. 다시 설정해주세요.');
        }
      }
    } finally {
      setLoading(false);
    }

    console.log(name, email, password);
  };
  return (
    <Wrapper>
      <Title>🎉 회원가입하기 🎉</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="이름을 적어주세요"
          type="text"
          required
        />
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
          value={isLoading ? '회원가입 중...' : '회원가입하기'}
        />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        회원가입을 하셨다면?{' '}
        <Link to="/login">
          <br />
          <br /> &rarr; 로그인하기
        </Link>
      </Switcher>
    </Wrapper>
  );
}
