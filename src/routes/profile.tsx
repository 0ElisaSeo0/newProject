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

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
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
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
  margin-bottom: -5px;
`;

const EditName = styled.span``;
const EditBtn = styled.button`
  font-size: 12px;
`;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
    console.log(posts.map((post) => post.text));
  };
  useEffect(() => {
    fetchPosts();
  }, [posts]);
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

  return (
    <Wrapper>
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
      <>
        {edit ? (
          <input value={name || ''} onChange={(e) => setName(e.target.value)} />
        ) : (
          <Name>{user?.displayName ? user.displayName : 'Anonymous'}</Name>
        )}
        <EditBtn onClick={onEdit}>{edit ? '저장' : '닉네임 수정'}</EditBtn>
      </>
      <Posts>
        {posts.map((post) => {
          return <Post key={post.id} {...post} />;
        })}
      </Posts>
    </Wrapper>
  );
}
