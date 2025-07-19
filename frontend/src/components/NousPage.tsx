import React, { useState } from 'react';
import { 
  Edit, 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  Tag, 
  Search, 
  Reply, 
  Forward, 
  Users,
  Calendar,
  Paperclip,
  Star,
  // Archive,
  User,
  Save,
  X,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Palette,
  Smile,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Corbeille from './Corbeille';
import Brouillons from './Brouillons';

interface Message {
  id: number;
  from: string;
  subject: string;
  date: string;
  time: string;
  category: string;
  content: string;
  read: boolean;
  starred: boolean;
  hasAttachment: boolean;
  deletedAt?: string;
}

interface Draft {    //draft= brouillon
  id: number;
  recipients: string;
  subject: string;
  content: string;
  lastModified: string;
  hasAttachment: boolean;
}

const NousPage = () => {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('reception');
  const [isComposing, setIsComposing] = useState(false);
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientSearch, setRecipientSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDraftId, setEditingDraftId] = useState<number | null>(null);
  const messagesPerPage = 10;
  
  // États pour le formatage
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('14');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [textColor, setTextColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // États pour les messages et corbeille
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "Dr. Camara",
      subject: "Correction des examens de mathématiques",
      date: "15 Dec 2024",
      time: "14:30",
      category: "Académique",
      content: "Bonjour, les corrections des examens de mathématiques sont maintenant disponibles. Vous pouvez consulter vos notes sur la plateforme. N'hésitez pas si vous avez des questions.",
      read: false,
      starred: true,
      hasAttachment: true
    },
    {
      id: 2,
      from: "Administration",
      subject: "Rappel: Paiement des frais de scolarité",
      date: "14 Dec 2024",
      time: "09:15",
      category: "Administration",
      content: "Rappel concernant le paiement des frais de scolarité pour le semestre en cours. La date limite est fixée au 20 décembre 2024.",
      read: true,
      starred: false,
      hasAttachment: false
    },
    {
      id: 3,
      from: "Prof. Diallo",
      subject: "Nouveau projet informatique",
      date: "13 Dec 2024",
      time: "16:45",
      category: "Projet",
      content: "Un nouveau projet de développement web a été ajouté à votre cursus. Les détails et les ressources sont disponibles dans l'espace cours.",
      read: true,
      starred: false,
      hasAttachment: true
    },
    {
      id: 4,
      from: "Bibliothèque",
      subject: "Nouveaux ouvrages disponibles",
      date: "12 Dec 2024",
      time: "11:20",
      category: "Information",
      content: "De nouveaux ouvrages scientifiques sont maintenant disponibles à la bibliothèque universitaire. Consultez le catalogue en ligne.",
      read: false,
      starred: false,
      hasAttachment: false
    },
    {
      id: 5,
      from: "Secrétariat",
      subject: "Convocation réunion parents",
      date: "11 Dec 2024",
      time: "08:30",
      category: "Réunion",
      content: "Vous êtes convoqué à la réunion parents-professeurs qui aura lieu le 18 décembre à 15h en salle de conférence.",
      read: true,
      starred: true,
      hasAttachment: false
    },
    // Ajout de messages supplémentaires pour tester la pagination
    {
      id: 6,
      from: "Prof. Bah",
      subject: "Cours de physique reporté",
      date: "10 Dec 2024",
      time: "16:00",
      category: "Académique",
      content: "Le cours de physique de demain est reporté à jeudi prochain à la même heure.",
      read: true,
      starred: false,
      hasAttachment: false
    },
    {
      id: 7,
      from: "Service informatique",
      subject: "Maintenance serveur",
      date: "09 Dec 2024",
      time: "08:00",
      category: "Information",
      content: "Une maintenance des serveurs aura lieu ce weekend. Les services en ligne seront temporairement indisponibles.",
      read: false,
      starred: false,
      hasAttachment: false
    },
    {
      id: 8,
      from: "Doyen",
      subject: "Assemblée générale",
      date: "08 Dec 2024",
      time: "14:00",
      category: "Réunion",
      content: "Assemblée générale de la faculté prévue le 15 décembre. Présence obligatoire pour tous les étudiants.",
      read: true,
      starred: true,
      hasAttachment: true
    },
    {
      id: 9,
      from: "Club étudiant",
      subject: "Événement culturel",
      date: "07 Dec 2024",
      time: "18:30",
      category: "Information",
      content: "Soirée culturelle organisée par le club étudiant le 20 décembre. Inscriptions ouvertes.",
      read: false,
      starred: false,
      hasAttachment: false
    },
    {
      id: 10,
      from: "Comptabilité",
      subject: "Reçu de paiement",
      date: "06 Dec 2024",
      time: "11:45",
      category: "Administration",
      content: "Votre reçu de paiement pour les frais de scolarité est disponible en téléchargement.",
      read: true,
      starred: false,
      hasAttachment: true
    },
    {
      id: 11,
      from: "Prof. Touré",
      subject: "Résultats TP informatique",
      date: "05 Dec 2024",
      time: "15:20",
      category: "Académique",
      content: "Les résultats du TP d'informatique sont disponibles. Consultez vos notes sur la plateforme.",
      read: true,
      starred: false,
      hasAttachment: false
    }
  ]);

  const [deletedMessages, setDeletedMessages] = useState<Message[]>([]);
  
  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: 1,
      recipients: "prof.diallo@univ.gn",
      subject: "Question sur le projet",
      content: "Bonjour Professeur,\n\nJ'aimerais avoir des précisions concernant le projet de fin de semestre...",
      lastModified: "15 Dec 2024 - 16:30",
      hasAttachment: false
    },
    {
      id: 2,
      recipients: "admin@univ.gn, secretariat@univ.gn",
      subject: "Demande de certificat",
      content: "Madame, Monsieur,\n\nJe souhaiterais obtenir un certificat de scolarité pour...",
      lastModified: "14 Dec 2024 - 10:15",
      hasAttachment: true
    }
  ]);

  // Fonctions de gestion des messages
  const handleDeleteMessage = (messageId: number) => {
    const messageToDelete = messages.find(msg => msg.id === messageId);
    if (messageToDelete) {
      const deletedMessage = {
        ...messageToDelete,
        deletedAt: new Date().toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setDeletedMessages(prev => [...prev, deletedMessage]);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setSelectedMessage(null);
    }
  };

  const handleRestoreMessage = (messageId: number) => {
    const messageToRestore = deletedMessages.find(msg => msg.id === messageId);
    if (messageToRestore) {
      const { deletedAt, ...restoredMessage } = messageToRestore;
      setMessages(prev => [...prev, restoredMessage]);
      setDeletedMessages(prev => prev.filter(msg => msg.id !== messageId));
    }
  };

  const handlePermanentDelete = (messageId: number) => {
    setDeletedMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  // Fonctions de gestion des brouillons
  const handleEditDraft = (draftId: number) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      setRecipients(draft.recipients);
      setSubject(draft.subject);
      setMessage(draft.content);
      setEditingDraftId(draftId);
      setIsComposing(true);
      setActiveSection('');
    }
  };

  const handleDeleteDraft = (draftId: number) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId));
  };

  const handleCompose = () => {
    setIsComposing(true);
    setActiveSection('');
    setEditingDraftId(null);
    setRecipients('');
    setSubject('');
    setMessage('');
  };

  const handleCancelCompose = () => {
    setIsComposing(false);
    setActiveSection('reception');
    setEditingDraftId(null);
    setRecipients('');
    setSubject('');
    setMessage('');
    setRecipientSearch('');
    // Réinitialiser les options de formatage
    setFontFamily('Arial');
    setFontSize('14');
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setTextAlign('left');
    setTextColor('#000000');
    setShowColorPicker(false);
    setShowEmojiPicker(false);
  };

  const handleSaveDraft = () => {
    const newDraft: Draft = {
      id: Date.now(),
      recipients,
      subject,
      content: message,
      lastModified: new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      hasAttachment: false
    };

    if (editingDraftId) {
      setDrafts(prev => prev.map(d => d.id === editingDraftId ? { ...newDraft, id: editingDraftId } : d));
    } else {
      setDrafts(prev => [...prev, newDraft]);
    }

    handleCancelCompose();
  };

  // Fonction pour obtenir le style du textarea
  const getTextareaStyle = () => {
    return {
      fontFamily: fontFamily,
      fontSize: `${fontSize}px`,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecoration: isUnderline ? 'underline' : 'none',
      textAlign: textAlign as 'left' | 'center' | 'right',
      color: textColor
    };
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination pour les messages
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const startIndex = (currentPage - 1) * messagesPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + messagesPerPage);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Académique': 'bg-blue-100 text-blue-800',
      'Administration': 'bg-red-100 text-red-800',
      'Projet': 'bg-green-100 text-green-800',
      'Information': 'bg-yellow-100 text-yellow-800',
      'Réunion': 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedMessage(null);
  };

  // Emojis populaires
  const popularEmojis = ['😀', '😊', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🎉', '🔥', '💯', '😂', '🥰', '😎', '🤗', '😴', '🤯', '🙄', '😬'];

  // Fonction pour insérer du texte à la position du curseur
  const insertTextAtCursor = (text: string) => {
    const textarea = document.getElementById('message-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.substring(0, start) + text + message.substring(end);
      setMessage(newMessage);
      
      // Repositionner le curseur après l'insertion
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
      }, 0);
    }
  };

  // Interface de composition
  const renderComposingInterface = () => (
    <div className="p-6">
      {/* Barre d’action */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            <Send className="h-4 w-4" />
            <span>Envoyer</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            <Save className="h-4 w-4" />
            <span>Sauvegarder</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <Paperclip className="h-4 w-4" />
            <span>Joindre</span>
          </button>
          <button onClick={handleCancelCompose} className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
            <X className="h-4 w-4" />
            <span>Annuler</span>
          </button>
        </div>
      </div>

      {/* Destinataires */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-3">
          <span className="text-lg font-semibold text-gray-800 w-4">À</span>
          <div className="flex items-center space-x-2 ml-4">
            <User className="h-5 w-5 text-gray-500" />
            <button className="text-blue-600 hover:text-blue-800 font-medium">Ajouter / modifier les destinataires</button>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="relative w-80">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un destinataire..."
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sujet */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-gray-800 w-16">Sujet</span>
          <input
            type="text"
            placeholder="Entrez le sujet du message..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ maxWidth: '320px' }}
          />
        </div>
      </div>

      {/* Fichier */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-gray-800 w-16">Fichier</span>
          <div className="flex items-center space-x-2">
            <Paperclip className="h-5 w-5 text-gray-500" />
            <button className="text-blue-600 hover:text-blue-800 font-medium">Joindre un fichier au message</button>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="mb-6">
        <div className="space-y-4">
          <span className="text-lg font-semibold text-gray-800">Message</span>

          {/* Barre de formatage */}
          <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-3">
            <div className="flex items-center space-x-3 flex-wrap">
              {/* Police / Taille */}
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="px-3 py-1 border rounded text-sm bg-white">
                {['Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 'Courier New', 'Comic Sans MS'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="px-3 py-1 border rounded text-sm bg-white">
                {[10, 12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>

              <div className="w-px h-6 bg-gray-300" />

              {/* Formatage */}
              <button onClick={() => setIsBold(!isBold)} className={`p-2 rounded ${isBold ? 'bg-blue-200' : 'hover:bg-gray-200'}`}><Bold className="h-4 w-4" /></button>
              <button onClick={() => setIsItalic(!isItalic)} className={`p-2 rounded ${isItalic ? 'bg-blue-200' : 'hover:bg-gray-200'}`}><Italic className="h-4 w-4" /></button>
              <button onClick={() => setIsUnderline(!isUnderline)} className={`p-2 rounded ${isUnderline ? 'bg-blue-200' : 'hover:bg-gray-200'}`}><Underline className="h-4 w-4" /></button>

              <div className="w-px h-6 bg-gray-300" />

              {/* Alignement */}
              <button onClick={() => setTextAlign('left')} className={`p-2 rounded ${textAlign === 'left' ? 'bg-blue-200' : 'hover:bg-gray-200'}`}><AlignLeft className="h-4 w-4" /></button>
              <button onClick={() => setTextAlign('center')} className={`p-2 rounded ${textAlign === 'center' ? 'bg-blue-200' : 'hover:bg-gray-200'}`}><AlignCenter className="h-4 w-4" /></button>
              <button onClick={() => setTextAlign('right')} className={`p-2 rounded ${textAlign === 'right' ? 'bg-blue-200' : 'hover:bg-gray-200'}`}><AlignRight className="h-4 w-4" /></button>

              <div className="w-px h-6 bg-gray-300" />

              {/* Listes */} <button onClick={() => insertTextAtCursor('• ')} className="p-2 hover:bg-gray-200 rounded"> <List className="h-4 w-4" /> </button> <button onClick={() => insertTextAtCursor('1. ')} className="p-2 hover:bg-gray-200 rounded"> <ListOrdered className="h-4 w-4" /> </button>

              <div className="w-px h-6 bg-gray-300" />

              {/* Couleur */} <div className="relative"> 
                <button onClick={() => setShowColorPicker(!showColorPicker)} className="p-2 rounded hover:bg-gray-200 flex items-center space-x-1"> 
                  <Palette className="h-4 w-4 text-gray-600" /> <div className="w-4 h-4 border border-gray-300 rounded" style={{ backgroundColor: textColor }}>
                  </div> 
                </button> {showColorPicker && ( <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded p-3 shadow-lg z-10"> 
                <div className="grid grid-cols-6 gap-2 mb-2"> 
                  {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB', '#A52A2A'].map((color) => ( 
                    <button key={color} onClick={() => { setTextColor(color); setShowColorPicker(false); 

                    }} className="w-6 h-6 rounded border hover:scale-110 transition" style={{ backgroundColor: color }} /> 
                  ))} 
                  </div> 
                      <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-8 rounded border border-gray-300" /> 
                  </div> )} 
                </div>

              {/* Emojis */} <div className="relative"> 
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 rounded hover:bg-gray-200"> 
                  <Smile className="h-4 w-4 text-gray-600" /> 
                  </button> {showEmojiPicker && ( 
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded p-3 shadow-lg z-10 w-64"> 
                      <div className="grid grid-cols-10 gap-1"> 
                      {popularEmojis.map((emoji, index) => ( 
                        <button key={index} onClick={() => { 
                          insertTextAtCursor(emoji); setShowEmojiPicker(false); 
                        }} 
                      className="text-lg hover:bg-gray-100 rounded p-1 transition"> {emoji} 
                  </button> 
                ))} 
            </div> 
        </div> 
      )} 
   </div> 
  </div> 
</div>

  {/* Zone de texte */} 
  <textarea id="message-textarea" value={message} 
    onChange={(e) => 
    setMessage(e.target.value)} placeholder="Tapez votre message ici..." 
    className="w-full h-64 p-4 border border-gray-300 border-t-0 rounded-b-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
    style={getTextareaStyle()} 
    onClick={() => { 
      setShowColorPicker(false); setShowEmojiPicker(false); 
      }} 
    /> 
</div> 
  
</div>

  {/* Boutons d'action */} 
  <div className="flex items-center justify-between pt-4 border-t border-gray-200"> 
    <button 
      className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-lg">Sauvegarder
    </button> 
    <div className="flex items-center space-x-3"> 
      <button 
        className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-lg">Envoyer
      </button> 
      <button onClick={handleCancelCompose} 
        className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition font-bold text-lg">Annuler
      </button> 
    </div> 
  </div> 
</div> 
); 
  

  // Interface des messages
  const renderMessagesInterface = () => (
    <>
      {/* Menu horizontal */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleCompose}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
              <span>Composer</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <Reply className="h-4 w-4" />
              <span>Répondre à Tous</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <Forward className="h-4 w-4" />
              <span>Transférer</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200">
              <Trash2 className="h-4 w-4" />
              <span>Supprimer</span>
            </button>
            {/* <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <Archive className="h-4 w-4" />
              <span>Trier</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <Tag className="h-4 w-4" />
              <span>Catégoriser</span>
            </button> */}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des messages */}
      <div className="divide-y divide-gray-200">
        {paginatedMessages.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
            <p className="text-gray-500">Votre boîte de réception est vide</p>
          </div>
        ) : (
          paginatedMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelectedMessage(selectedMessage === msg.id ? null : msg.id)}
              className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                selectedMessage === msg.id ? 'bg-blue-50' : ''
              } ${!msg.read ? 'bg-blue-25' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center space-x-2">
                    {msg.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    {msg.hasAttachment && <Paperclip className="h-4 w-4 text-gray-400" />}
                    {!msg.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`font-medium ${!msg.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {msg.from}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(msg.category)}`}>
                          {msg.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{msg.date}</span>
                          <span>{msg.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Logique pour répondre
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            title="Répondre"
                          >
                            <Reply className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMessage(msg.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1">
                      <p className={`${!msg.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {msg.subject}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu du message (affiché si sélectionné) */}
              {selectedMessage === msg.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {msg.from.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{msg.from}</p>
                          <p className="text-sm text-gray-500">{msg.date} à {msg.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            // Logique pour répondre
                            handleCompose();
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                          <Reply className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-100 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                    {msg.hasAttachment && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Paperclip className="h-4 w-4" />
                          <span>Document_cours.pdf</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {startIndex + 1} à {Math.min(startIndex + messagesPerPage, filteredMessages.length)} sur {filteredMessages.length} messages
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Rendu conditionnel pour les différentes sections
  const renderContent = () => {
    if (activeSection === 'corbeille') {
      return (
        <Corbeille
          deletedMessages={deletedMessages}
          onRestoreMessage={handleRestoreMessage}
          onPermanentDelete={handlePermanentDelete}
        />
      );
    }

    if (activeSection === 'brouillons') {
      return (
        <Brouillons
          drafts={drafts}
          onCompose={handleCompose}
          onEditDraft={handleEditDraft}
          onDeleteDraft={handleDeleteDraft}
        />
      );
    }

    if (isComposing) {
      return renderComposingInterface();
    }

    return renderMessagesInterface();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section horizontale avec "Nous" */}
      <div className="relative mt-20 h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <Users className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Nous</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Menu vertical gauche - 1/3 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Messagerie</h3>
              
              <div className="space-y-2">
                <button 
                  onClick={handleCompose}
                  className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors duration-200 ${
                    isComposing 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-blue-50 text-gray-700'
                  }`}
                >
                  <Edit className="h-5 w-5" />
                  <span className={`font-medium ${isComposing ? 'font-bold' : ''}`}>Composer</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveSection('reception');
                    setIsComposing(false);
                    setCurrentPage(1);
                  }}
                  className={`w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors duration-200 ${
                    activeSection === 'reception' && !isComposing
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Inbox className="h-5 w-5 text-gray-600" />
                    <span className={activeSection === 'reception' && !isComposing ? 'font-bold' : 'font-medium'}>
                      Réception
                    </span>
                  </div>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{messages.filter(m => !m.read).length}</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveSection('envoyes');
                    setIsComposing(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors duration-200 ${
                    activeSection === 'envoyes' && !isComposing
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Send className="h-5 w-5 text-gray-600" />
                  <span className={activeSection === 'envoyes' && !isComposing ? 'font-bold' : 'font-medium'}>
                    Envoyés
                  </span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveSection('brouillons');
                    setIsComposing(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors duration-200 ${
                    activeSection === 'brouillons' && !isComposing
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span className={activeSection === 'brouillons' && !isComposing ? 'font-bold' : 'font-medium'}>
                      Brouillons
                    </span>
                  </div>
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{drafts.length}</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveSection('corbeille');
                    setIsComposing(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors duration-200 ${
                    activeSection === 'corbeille' && !isComposing
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Trash2 className="h-5 w-5 text-gray-600" />
                    <span className={activeSection === 'corbeille' && !isComposing ? 'font-bold' : 'font-medium'}>
                      Corbeille
                    </span>
                  </div>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{deletedMessages.length}</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveSection('categories');
                    setIsComposing(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors duration-200 ${
                    activeSection === 'categories' && !isComposing
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Tag className="h-5 w-5 text-gray-600" />
                  <span className={activeSection === 'categories' && !isComposing ? 'font-bold' : 'font-medium'}>
                    Catégories
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Section principale - 2/3 */}
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