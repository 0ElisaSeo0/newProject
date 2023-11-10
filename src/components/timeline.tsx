import {
  Unsubscribe,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import Post from './post';

export interface IPost {
  id: string;
  photo?: string | null;
  text: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  overflow-y: scroll;
  margin-bottom: 50px;
`;

export default function Timeline() {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async () => {
      const postQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(25)
      );
      // const snapshot = await getDocs(postQuery);
      // const posts = snapshot.docs.map((doc) => {
      //   const { photo, text, createdAt, userId, username } = doc.data();
      //   return {
      //     photo,
      //     text,
      //     createdAt,
      //     userId,
      //     username,
      //     id: doc.id,
      //   };
      // });
      unsubscribe = await onSnapshot(postQuery, (snapshot) => {
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
        setPosts(posts);
      });
    };
    fetchPosts();
    console.log('timeline11');
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </Wrapper>
  );
}
