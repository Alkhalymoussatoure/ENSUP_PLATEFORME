import React, { useState } from 'react';
import HeaderBanner from './MessagerieInterne/HeaderBanner';
import SidebarMenu from '../components/MessagerieInterne/SidebarMenu';
import MessageComposer from '../components/MessagerieInterne/MessageComposer';
import MessageList from '../components/MessagerieInterne/MessageList';
import MessageViewer from '../components/MessagerieInterne/MessageViewer';
import SectionCorbeille from '../components/MessagerieInterne/SectionCorbeille';
import SectionBrouillons from '../components/MessagerieInterne/SectionBrouillons';
import SectionEnvoyes from '../components/MessagerieInterne/SectionEnvoyes';
import SectionCategories from '../components/MessagerieInterne/SectionCategories';

const NousPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('reception');
  const [isComposing, setIsComposing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  

  const [messages, setMessages] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [deletedMessages, setDeletedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [categorizedMessages, setCategorizedMessages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [file, setFile] = useState<File | null>(null);
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [fontSize, setFontSize] = useState('14');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [textColor, setTextColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const currentPage = 1;
  const totalPages = 1;
  const startIndex = 0;
  const paginatedMessages = messages.slice(startIndex, startIndex + 10);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Important': return 'bg-red-100 text-red-700';
      case 'Perso': return 'bg-green-100 text-green-700';
      case 'Pro': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedMessage(null);
  };

  const handleCancelCompose = () => setIsComposing(false);
  const handleSaveDraft = () => {/* logique à connecter */};
  const handleSendMessage = () => {/* logique à connecter */};
  const handleDeleteMessage = (id: number) => {/* logique à connecter */};
  const handleRestoreMessage = (id: number) => {/* logique à connecter */};
  const handlePermanentDelete = (id: number) => {/* logique à connecter */};
  const handleEditDraft = (id: number) => {/* logique à connecter */};
  const handleDeleteDraft = (id: number) => {/* logique à connecter */};
  const handlePageChange = (page: number) => {/* logique à connecter */};

  const handleChangeSection = (section: string) => {
    setIsComposing(false);
    setSelectedMessage(null);
    setActiveSection(section);
  };

  const renderContent = () => {
    if (isComposing) {
      return (
        <MessageComposer
          recipients={recipients}
          subject={subject}
          message={message}
          onCancel={handleCancelCompose}
          onSave={handleSaveDraft}
          onSend={handleSendMessage}
          onUpdateMessage={setMessage}
          file={file}
          setFile={setFile}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          isBold={isBold}
          setBold={setIsBold}
          isItalic={isItalic}
          setItalic={setIsItalic}
          isUnderline={isUnderline}
          setUnderline={setIsUnderline}
          textAlign={textAlign}
          setTextAlign={setTextAlign}
          textColor={textColor}
          setTextColor={setTextColor}
          showColorPicker={showColorPicker}
          setShowColorPicker={setShowColorPicker}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
        />
      );
    }

    switch (activeSection) {
      case 'corbeille':
        return (
          <SectionCorbeille
            deletedMessages={deletedMessages}
            onRestoreMessage={handleRestoreMessage}
            onPermanentDelete={handlePermanentDelete}
          />
        );
      case 'brouillons':
        return (
          <SectionBrouillons
            drafts={drafts}
            onEditDraft={handleEditDraft}
            onDeleteDraft={handleDeleteDraft}
            onCompose={handleCompose}
          />
        );
      case 'envoyes':
        return <SectionEnvoyes sentMessages={sentMessages} />;
      case 'categories':
        return (
          <SectionCategories
            messages={categorizedMessages}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        );
      case 'reception':
      default:
        return (
          <>
            <MessageList
              messages={paginatedMessages}
              selectedMessage={selectedMessage}
              onSelect={setSelectedMessage}
              onDelete={handleDeleteMessage}
              onReply={handleCompose}
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              onPageChange={handlePageChange}
              getCategoryColor={getCategoryColor}
              setUnreadCount={setUnreadCount}
            />
            {selectedMessage && (
              <MessageViewer
                message={messages.find((m: any) => m.id === selectedMessage)!}
                onReply={handleCompose}
                onDelete={handleDeleteMessage}
              />
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <SidebarMenu
              activeSection={activeSection}
              setActiveSection={handleChangeSection}
              isComposing={isComposing}
              handleCompose={handleCompose}
              // unreadCount={messages.filter((m: any) => !m.read).length}
              unreadCount={unreadCount}
              draftCount={drafts.length}
              trashCount={deletedMessages.length}
            />
          </div>
          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-sm">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NousPage;
