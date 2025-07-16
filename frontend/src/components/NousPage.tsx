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
  Archive,
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
  Smile
} from 'lucide-react';

const NousPage = () => {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('reception');
  const [isComposing, setIsComposing] = useState(false);
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientSearch, setRecipientSearch] = useState('');
  
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

  // Fonction pour appliquer le formatage
  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };
  const role = localStorage.getItem("role");
  
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

  // Emojis populaires
  const popularEmojis = ['😀', '😊', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🎉', '🔥', '💯', '😂', '🥰', '😎', '🤗', '😴', '🤯', '🙄', '😬'];

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
 

  const messages = [
    {
      id: 1,
      from: "Dr. Camara",
      subject: "Correction des examens de mathématiques",
      date: "15 Dec 2025",
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
      date: "14 Dec 2025",
      time: "09:15",
      category: "Administration",
      content: "Rappel concernant le paiement des frais de scolarité pour le semestre en cours. La date limite est fixée au 20 décembre 2025.",
      read: true,
      starred: false,
      hasAttachment: false
    },
    {
      id: 3,
      from: "Prof. Diallo",
      subject: "Nouveau projet informatique",
      date: "13 Dec 2025",
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
      date: "12 Dec 2025",
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
      date: "11 Dec 2025",
      time: "08:30",
      category: "Réunion",
      content: "Vous êtes convoqué à la réunion parents-professeurs qui aura lieu le 18 décembre à 15h en salle de conférence.",
      read: true,
      starred: true,
      hasAttachment: false
    }
  ];

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleCompose = () => {
    setIsComposing(true);
    setActiveSection('');
  };

  const handleCancelCompose = () => {
    setIsComposing(false);
    setActiveSection('reception');
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
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">5</span>
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
                  className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors duration-200 ${
                    activeSection === 'brouillons' && !isComposing
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className={activeSection === 'brouillons' && !isComposing ? 'font-bold' : 'font-medium'}>
                    Brouillons
                  </span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveSection('corbeille');
                    setIsComposing(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors duration-200 ${
                    activeSection === 'corbeille' && !isComposing
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Trash2 className="h-5 w-5 text-gray-600" />
                  <span className={activeSection === 'corbeille' && !isComposing ? 'font-bold' : 'font-medium'}>
                    Corbeille
                  </span>
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
              {!isComposing ? (
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
                        <span>Répondre
                        </span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                        <Forward className="h-4 w-4" />
                        <span>Transférer</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200">
                        <Trash2 className="h-4 w-4" />
                        <span>Supprimer</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                        <Archive className="h-4 w-4" />
                        <span>Trier</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                        <Tag className="h-4 w-4" />
                        <span>Catégoriser</span>
                      </button>
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
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
                      className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                        !message.read ? 'bg-blue-50' : ''
                      } ${selectedMessage === message.id ? 'bg-blue-100' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex items-center space-x-2">
                            {message.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            {message.hasAttachment && <Paperclip className="h-4 w-4 text-gray-400" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className={`font-medium ${!message.read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                                  {message.from}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(message.category)}`}>
                                  {message.category}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>{message.date}</span>
                                <span>{message.time}</span>
                              </div>
                            </div>
                            <div className="mt-1">
                              <p className={`${!message.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                {message.subject}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contenu du message (affiché si sélectionné) */}
                      {selectedMessage === message.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {message.from.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{message.from}</p>
                                  <p className="text-sm text-gray-500">{message.date} à {message.time}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors duration-200">
                                  <Reply className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors duration-200">
                                  <Forward className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors duration-200">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <p className="text-gray-700 leading-relaxed">{message.content}</p>
                            </div>
                            {message.hasAttachment && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Paperclip className="h-4 w-4" />
                                  <span>Document_cours.pdf</span>
                                  <button className="text-blue-600 hover:text-blue-800">Télécharger</button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
              ) : (
                /* Interface de composition */
                <div className="p-6">
                  {/* Barre de navigation horizontale */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
                        <Send className="h-4 w-4" />
                        <span>Envoyer</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                        <Save className="h-4 w-4" />
                        <span>Sauvegarder</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                        <Paperclip className="h-4 w-4" />
                        <span>Joindre</span>
                      </button>
                      <button 
                        onClick={handleCancelCompose}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                        <span>Annuler</span>
                      </button>
                    </div>
                  </div>

                  {/* Section À */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-lg font-semibold text-gray-800 w-4">À</span>
                      <div className="flex items-center space-x-2 ml-4">
                        <User className="h-5 w-5 text-gray-500" />
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Ajouter / modifier les destinataires
                        </button>
                      </div>
                      <div className="flex-1 flex justify-end">
                        <div className="relative w-80">
                          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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

                  {/* Section Sujet */}
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

                  {/* Section Fichier */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-800 w-16">Fichier</span>
                      <div className="flex items-center space-x-2">
                        <Paperclip className="h-5 w-5 text-gray-500" />
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Joindre un fichier au message
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section Message */}
                  <div className="mb-6">
                    <div className="space-y-4">
                      <span className="text-lg font-semibold text-gray-800">Message</span>
                      
                      {/* Barre d'outils de formatage moderne */}
                      <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-3">
                        <div className="flex items-center space-x-3 flex-wrap">
                          {/* Police */}
                          <select 
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Comic Sans MS">Comic Sans MS</option>
                          </select>
                          
                          {/* Taille */}
                          <select 
                            value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="10">10</option>
                            <option value="12">12</option>
                            <option value="14">14</option>
                            <option value="16">16</option>
                            <option value="18">18</option>
                            <option value="20">20</option>
                            <option value="24">24</option>
                            <option value="28">28</option>
                            <option value="32">32</option>
                          </select>
                          
                          <div className="w-px h-6 bg-gray-300"></div>
                          
                          {/* Formatage */}
                          <button 
                            onClick={() => setIsBold(!isBold)}
                            className={`p-2 rounded transition-colors duration-200 group ${
                              isBold ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
                            }`}
                          >
                            <Bold className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                          </button>
                          <button 
                            onClick={() => setIsItalic(!isItalic)}
                            className={`p-2 rounded transition-colors duration-200 group ${
                              isItalic ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
                            }`}
                          >
                            <Italic className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                          </button>
                          <button 
                            onClick={() => setIsUnderline(!isUnderline)}
                            className={`p-2 rounded transition-colors duration-200 group ${
                              isUnderline ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
                            }`}
                          >
                            <Underline className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                          </button>
                          
                          <div className="w-px h-6 bg-gray-300"></div>
                          
                          {/* Alignement */}
                          <button 
                            onClick={() => setTextAlign('left')}
                            className={`p-2 rounded transition-colors duration-200 group ${
                              textAlign === 'left' ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
                            }`}
                          >
                            <AlignLeft className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                          </button>
                          <button 
                            onClick={() => setTextAlign('center')}
                            className={`p-2 rounded transition-colors duration-200 group ${
                              textAlign === 'center' ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
                            }`}
                          >
                            <AlignCenter className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                          </button>
                          <button 
                            onClick={() => setTextAlign('right')}
                            className={`p-2 rounded transition-colors duration-200 group ${
                              textAlign === 'right' ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
                            }`}
                          >
                            <AlignRight className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                          </button>
                          
                          <div className="w-px h-6 bg-gray-300"></div>
                          
                          {/* Listes */}
                          <button 
                            onClick={() => insertTextAtCursor('• ')}
                            className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 group"
                          >
                            <List className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                          </button>
                          <button 
                            onClick={() => insertTextAtCursor('1. ')}
                            className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 group"
                          >
                            <ListOrdered className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                          </button>
                          
                          <div className="w-px h-6 bg-gray-300"></div>
                          
                          {/* Couleur */}
                          <div className="relative">
                            <button 
                              onClick={() => setShowColorPicker(!showColorPicker)}
                              className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 group flex items-center space-x-1"
                            >
                              <Palette className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                              <div 
                                className="w-4 h-4 rounded border border-gray-300"
                                style={{ backgroundColor: textColor }}
                              ></div>
                            </button>
                            
                            {showColorPicker && (
                              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10">
                                <div className="grid grid-cols-6 gap-2 mb-3">
                                  {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB', '#A52A2A'].map((color) => (
                                    <button
                                      key={color}
                                      onClick={() => {
                                        setTextColor(color);
                                        setShowColorPicker(false);
                                      }}
                                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform duration-200"
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                                <input
                                  type="color"
                                  value={textColor}
                                  onChange={(e) => setTextColor(e.target.value)}
                                  className="w-full h-8 rounded border border-gray-300"
                                />
                              </div>
                            )}
                          </div>
                          
                          {/* Emoji */}
                          <div className="relative">
                            <button 
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                              className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 group"
                            >
                              <Smile className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                            </button>
                            
                            {showEmojiPicker && (
                              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10 w-64">
                                <div className="grid grid-cols-10 gap-1">
                                  {popularEmojis.map((emoji, index) => (
                                    <button
                                      key={index}
                                      onClick={() => {
                                        insertTextAtCursor(emoji);
                                        setShowEmojiPicker(false);
                                      }}
                                      className="text-lg hover:bg-gray-100 rounded p-1 transition-colors duration-200"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Zone de texte */}
                      <textarea
                        id="message-textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tapez votre message ici..."
                        className="w-full h-64 p-4 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        style={getTextareaStyle()}
                        onClick={() => {
                          setShowColorPicker(false);
                          setShowEmojiPicker(false);
                        }}
                      />
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-lg">
                      Sauvegarder
                    </button>
                    <div className="flex items-center space-x-3">
                      <button className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium text-lg">
                        Envoyer
                      </button>
                      <button 
                        onClick={handleCancelCompose}
                        className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-bold text-lg"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NousPage;