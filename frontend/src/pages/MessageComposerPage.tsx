// src/pages/MessageComposerPage.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MessageComposer from '../components/MessagerieInterne/MessageComposer';
import { useUserContext } from '../hooks/useUserContext';

const MessageComposerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useUserContext(); 
  const state = location.state || {};

  // Initialisation des états dynamiques
  const [message, setMessage] = useState(
    state.citation ? `\n\n------\n${state.citation}` : ''
  );
  const [subject, setSubject] = useState(state.sujet || '');
  const [recipients, setRecipients] = useState(
    state.destinataires?.join(',') || ''
  );

  // États de style et options
  const [file, setFile] = useState<File | null>(null);
  const [fontSize, setFontSize] = useState('16');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isBold, setBold] = useState(false);
  const [isItalic, setItalic] = useState(false);
  const [isUnderline, setUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [textColor, setTextColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div className="p-4">
      <MessageComposer
        recipients={recipients}
        subject={subject}
        message={message}
        onCancel={() => navigate(-1)}
        onSave={() => console.log('Message sauvegardé')}
        onSend={() => navigate(`/${slug}/nous`)}
        onUpdateMessage={setMessage}
        onUpdateSubject={setSubject}
        onUpdateRecipients={setRecipients}
        file={file}
        setFile={setFile}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        isBold={isBold}
        setBold={setBold}
        isItalic={isItalic}
        setItalic={setItalic}
        isUnderline={isUnderline}
        setUnderline={setUnderline}
        textAlign={textAlign}
        setTextAlign={setTextAlign}
        textColor={textColor}
        setTextColor={setTextColor}
        showColorPicker={showColorPicker}
        setShowColorPicker={setShowColorPicker}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
      />
    </div>
  );
};

export default MessageComposerPage;
