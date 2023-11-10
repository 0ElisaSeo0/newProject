import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { IPost } from '../components/timeline';
import Post from '../components/post';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-direction: column;
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-direction: row;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #ffcfc7;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
  margin-left: 30px;
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const NickName = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const Name = styled.span`
  font-size: 22px;
  margin-bottom: -5px;
`;

const EditBtn = styled.button`
  font-size: 12px;
`;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
  margin-bottom: 70px;
`;

const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70px;
  width: 50px;
  border-radius: 50%;
  gap: 5px;
  svg {
    width: 30px;
    fill: #010193;
  }
  &.log-out {
    border-color: tomato;
    svg {
      fill: tomato;
    }
  }
  margin-left: 20px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [posts, setProfilePosts] = useState<IPost[]>([]);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user?.displayName);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) {
      return;
    }
    if (files && files.length === 1 && files[0].size < 1000000) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    } else if (files && files.length === 1 && files[0].size >= 1000000) {
      alert('1MB 미만으로 추가해주세요');
    }
  };
  const fetchPosts = async () => {
    const postQuery = query(
      collection(db, 'posts'),
      where('userId', '==', user?.uid),
      orderBy('createdAt', 'desc'),
      limit(25)
    );
    const snapshot = await getDocs(postQuery);
    const posts = snapshot.docs.map((doc) => {
      const { photo, text, createdAt, userId, username } = doc.data();
      return {
        photo,
        text,
        createdAt,
        userId,
        username,
        id: doc.id,
      };
    });
    setProfilePosts(posts);
  };
  useEffect(() => {
    fetchPosts();
    console.log('111');
  }, []);
  const onEdit = async () => {
    if (!user) {
      return;
    }
    if (edit) {
      await updateProfile(user, {
        displayName: name,
      });
      setEdit(false);
    } else {
      setEdit(true);
    }
  };
  const navigate = useNavigate();
  const onLogOut = async () => {
    const ok = confirm('로그아웃 하시겠어요?');
    if (ok) {
      await auth.signOut();
      navigate('/');
    }
  };

  return (
    <Wrapper>
      <Wrap>
        {' '}
        <AvatarUpload htmlFor="avatar">
          {avatar ? (
            <AvatarImg src={avatar} />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6">
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </AvatarUpload>
        <AvatarInput
          id="avatar"
          type="file"
          accept="image/*"
          onChange={onAvatarChange}
        />
        <NickName>
          {edit ? (
            <input
              value={name || ''}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <Name>{user?.displayName ? user.displayName : 'Anonymous'}</Name>
          )}
          <EditBtn onClick={onEdit}>{edit ? '저장' : '닉네임 수정'}</EditBtn>
        </NickName>
        <MenuItem className="log-out" onClick={onLogOut}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          <div>나가기</div>
        </MenuItem>
      </Wrap>
      <Posts>
        {posts.map((post) => {
          return <Post key={post.id} {...post} />;
        })}
      </Posts>
    </Wrapper>
  );
}
