import styled from 'styled-components';
import { IPost } from './timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { useState } from 'react';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 3px solid rgba(156, 156, 156, 0.164);
  border-radius: 15px;
`;

const Column = styled.div`
  &.photo {
    position: relative;
  }
`;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteBtn = styled.button`
  background-color: #4f4f4f;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 5px;
  cursor: pointer;
`;

const EditBtn = styled(DeleteBtn)`
  background-color: tomato;
`;

const EditPhotoLabel = styled.label`
  background-color: #010101;
  color: white;
  font-weight: 600;
  border: 1px solid black;
  font-size: 12px;
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 5px;
  position: absolute;
  top: 70%;
  left: 13%;
  /* transform: translate(-50%, -50%); */
`;
const EditPhoto = styled.input`
  display: none;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FullBtn = styled.button`
  padding: 5px 30px;
  margin-right: 10px;
`;

export default function Post({ username, photo, text, userId, id }: IPost) {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [editedPhoto, setEditedPhoto] = useState<File | null>();
  const onEdit = async () => {
    if (user?.uid !== userId) {
      return;
    }
    setIsEditing(true);
  };

  const onSaveEdit = async () => {
    if (!user || user?.uid !== userId) {
      return;
    }
    try {
      const postRef = doc(db, 'posts', id);
      const updatedData = {
        text: editedText,
      };
      if (editedPhoto !== null && editedPhoto !== photo) {
        const locationRef = ref(storage, `posts/${user.uid}/${id}`);

        const result = await uploadBytes(locationRef, editedPhoto);
        const url = await getDownloadURL(result.ref);
        updatedData.photo = url;
      }
      await updateDoc(postRef, updatedData);
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    }
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    setEditedText(text);
    if (photo) {
      setEditedPhoto(photo);
    }
  };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1 && files[0].size < 1000000) {
      setEditedPhoto(files[0]);
    } else if (files && files.length === 1 && files[0].size >= 1000000) {
      alert('1MB 미만으로 추가해주세요');
    }
  };

  const onDelete = async () => {
    const ok = confirm('게시물을 삭제하시겠습니까?');
    if (!ok || user?.uid !== userId) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'posts', id));
      if (photo) {
        const photoRef = ref(storage, `posts/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Wrapper>
      <>
        <Column>
          <Username>{username}</Username>
          {isEditing ? (
            <>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={4}
                cols={50}
              />
            </>
          ) : (
            <Payload>{text}</Payload>
          )}
          {user?.uid === userId ? (
            <>
              <EditBtn onClick={onEdit}>수정</EditBtn>
              <DeleteBtn onClick={onDelete}>삭제</DeleteBtn>
            </>
          ) : null}
        </Column>
        {photo ? (
          <Column className="photo">
            <Photo src={photo} />
            {isEditing ? (
              <>
                <EditPhotoLabel htmlFor="photo">수정</EditPhotoLabel>
                <EditPhoto
                  onChange={onPhotoChange}
                  type="file"
                  id="photo"
                  accept="image/*"
                />
              </>
            ) : null}
          </Column>
        ) : null}
      </>
      <Column>
        {' '}
        {isEditing ? (
          <Container>
            <FullBtn onClick={onSaveEdit}>저장</FullBtn>
            <FullBtn onClick={onCancelEdit}>취소</FullBtn>
          </Container>
        ) : null}
      </Column>
    </Wrapper>
  );
}
