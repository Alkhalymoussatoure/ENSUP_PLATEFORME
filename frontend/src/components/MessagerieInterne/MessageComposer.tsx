import React, { useState } from 'react';
import DestinataireSelectorModal from './DestinataireSelectorModal';
import { useUserContext } from '../../hooks/useUserContext';

import {
  Send, Save, Paperclip, X,
  User, Search, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Palette, Smile
} from 'lucide-react';

type User = {
  id: number;
  name: string;
  matricule: string;
  sectionId: number;
  departementId: number;
};

export interface MessageComposerProps {
  recipients: string;
  subject: string;
  message: string;
  onCancel: () => void;
  onSave: () => void;
  onSend: () => void;
  onUpdateMessage: (text: string) => void;
  onUpdateSubject?: (text: string) => void;
  onUpdateRecipients?: (text: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  isBold: boolean;
  setBold: (value: boolean) => void;
  isItalic: boolean;
  setItalic: (value: boolean) => void;
  isUnderline: boolean;
  setUnderline: (value: boolean) => void;
  textAlign: string;
  setTextAlign: (value: string) => void;
  textColor: string;
  setTextColor: (value: string) => void;
  showColorPicker: boolean;
  setShowColorPicker: (value: boolean) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (value: boolean) => void;
}

const popularEmojis = ['😀', '😂', '😊', '😍', '🤔', '🙌', '👍', '🎉', '📎', '❤️'];

const MessageComposer: React.FC<MessageComposerProps> = ({
  recipients, subject, message, onCancel, onSave, onSend, onUpdateMessage,
  onUpdateSubject, onUpdateRecipients,
  file, setFile, fontSize, setFontSize, fontFamily, setFontFamily,
  isBold, setBold, isItalic, setItalic, isUnderline, setUnderline,
  textAlign, setTextAlign, textColor, setTextColor,
  showColorPicker, setShowColorPicker, showEmojiPicker, setShowEmojiPicker,
}) => {
  const { slug, token } = useUserContext();

  const [showDestinataireModal, setShowDestinataireModal] = useState(false);
  const [departementId, setDepartementId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [messageType, setMessageType] = useState<'prive' | 'section' | 'departement'>('prive');
  const [localSubject, setLocalSubject] = useState(subject);
  const [localRecipients, setLocalRecipients] = useState(recipients);
  const [isLoading, setIsLoading] = useState(false);
  const insertTextAtCursor = (text: string) => {
    const textarea = document.getElementById('message-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = textarea.value.slice(0, start) + text + textarea.value.slice(end);
    onUpdateMessage(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const getTextareaStyle = (): React.CSSProperties => ({
    fontFamily,
    fontSize: `${fontSize}px`,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration: isUnderline ? 'underline' : 'none',
    textAlign: textAlign as 'left' | 'center' | 'right',
    color: textColor,
  });

  const handleSubjectChange = (value: string) => {
    setLocalSubject(value);
    if (onUpdateSubject) onUpdateSubject(value);
  };

  const handleRecipientsChange = (value: string) => {
    setLocalRecipients(value);
    if (onUpdateRecipients) onUpdateRecipients(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // La bonne gestion de la sélection faite depuis la modale
  const handleModalConfirm = (
    mode: 'prive' | 'section' | 'departement',
    payload: string | string[]
  ) => {
    setMessageType(mode);

    if (mode === 'prive') {
      const value = (payload as string[]).join(',');
      setLocalRecipients(value);
      if (onUpdateRecipients) onUpdateRecipients(value);
    } else if (mode === 'section') {
      setSectionId(payload as string);
      setLocalRecipients('');
    } else if (mode === 'departement') {
      setDepartementId(payload as string);
      setLocalRecipients('');
    }

    setShowDestinataireModal(false);
  };

  // ✅ VERSION CORRIGÉE - Plus d'erreur de stream déjà lu
  const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  if (!localSubject.trim()) {
    alert('Veuillez entrer un sujet');
    return;
  }

  if (!message.trim()) {
    alert('Veuillez entrer un message');
    return;
  }

  const hasRecipients =
    (messageType === 'prive' && localRecipients.trim()) ||
    (messageType === 'section' && sectionId) ||
    (messageType === 'departement' && departementId);

  if (!hasRecipients) {
    alert('Veuillez sélectionner au moins un destinataire');
    return;
  }

  const formData = new FormData();
  formData.append('mode_envoi', messageType);
  formData.append('type_message', messageType);
  formData.append('sujet', localSubject);
  formData.append('contenu', message);

  if (file) formData.append('fichier_joint', file);

  if (messageType === 'prive') {
    localRecipients.split(',').forEach((m) =>
      formData.append('destinataires', m.trim())
    );
  }
  if (messageType === 'section') formData.append('section_id', sectionId);
  if (messageType === 'departement') formData.append('departement_id', departementId);

  // 🔍 Logs utiles pour vérification
  console.log('Token utilisé :', token);
  console.log('Slug :', slug);
  console.log('Mode envoi :', messageType);
  console.log('Destinataires :', localRecipients);
  console.log('Section ID :', sectionId);
  console.log('Département ID :', departementId);

  try {
    const res = await fetch(`http://localhost:8000/api/${slug}/messages/send/`, {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    });

    const responseText = await res.text();
    console.log('Status:', res.status);
    console.log('Corps de réponse:', responseText);

    if (!res.ok) {
      let messageErreur = `Erreur ${res.status}`;
      try {
        const erreur = JSON.parse(responseText);
        messageErreur += ' — ' + (erreur.message || erreur.detail || responseText);
      } catch {
        messageErreur += ' — ' + responseText;
      }
      throw new Error(messageErreur);
    }

    let data = {};
    try {
      data = JSON.parse(responseText);
      console.log('Réponse JSON parsée :', data);
    } catch {
      console.warn('Réponse non JSON.');
    }
    finally {
      setIsLoading(false);
    }
    alert(' Message envoyé avec succès');
    onSend();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Échec de l'envoi du message.";
    console.error('Erreur envoi :', err);
    alert(msg);
  }

};

   return (
  <form onSubmit={handleSendMessage} encType="multipart/form-data">
    <div className="p-6">
      {/* Barre d'action */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button type="submit" className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            <Send className="h-4 w-4" />
            <span>Envoyer</span>
          </button>
          <button type="button" onClick={onSave} className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            <Save className="h-4 w-4" />
            <span>Sauvegarder</span>
          </button>
          <label htmlFor="file-input" className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer">
            <Paperclip className="h-4 w-4" />
            <span>Joindre</span>
          </label>
          <input id="file-input" type="file" className="hidden" onChange={handleFileChange} />
          <button type="button" onClick={onCancel} className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
            <X className="h-4 w-4" />
            <span>Annuler</span>
          </button>
        </div>
      </div>

      {/* Modale destinataires */}
      {showDestinataireModal && (
        <DestinataireSelectorModal
          isOpen={showDestinataireModal}
          onClose={() => setShowDestinataireModal(false)}
          onConfirm={handleModalConfirm}
        />
      )}

      {/* Destinataires */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-3">
          <span className="text-lg font-semibold text-gray-800 w-4">À</span>
          <div className="flex items-center space-x-2 ml-4">
            <User className="h-5 w-5 text-gray-500" />
            <button
              type="button"
              onClick={() => setShowDestinataireModal(true)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Ajouter / modifier les destinataires
            </button>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="relative w-80">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un destinataire..."
                value={localRecipients}
                onChange={(e) => handleRecipientsChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={messageType !== 'prive'}
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
            value={localSubject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ maxWidth: '320px' }}
            required
          />
        </div>
      </div>

      {/* Fichier sélectionné */}
      {file && (
        <div className="mb-4 text-sm text-gray-600 flex items-center space-x-2">
          <Paperclip className="h-4 w-4" />
          <span>{file.name}</span>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="text-red-500 hover:underline"
          >
            Retirer
          </button>
        </div>
      )}

      {/* Zone de texte avec formatage */}
      <div className="mb-6">
        <div className="space-y-4">
          <span className="text-lg font-semibold text-gray-800">Message</span>

          {/* Barre de formatage */}
          <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-3">
            <div className="flex items-center space-x-3 flex-wrap">
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

              <button type="button" onClick={() => setBold(!isBold)} className={`p-2 rounded ${isBold ? 'bg-blue-200' : 'hover:bg-gray-200'}`}><Bold className="h-4 w-4" /></button>
              <button type="button" onClick={() => setItalic(!isItalic)} className={`p-2 rounded ${isItalic ? 'bg-blue-200' : 'hover:bg-gray-200'}`}><Italic className="h-4 w-4" /></button>
              <button type="button" onClick={() => setUnderline(!isUnderline)} className={`p-2 rounded ${isUnderline ? 'bg-blue-200' : 'hover:bg-gray-200'}`}><Underline className="h-4 w-4" /></button>

              <div className="w-px h-6 bg-gray-300" />

              <button type="button" onClick={() => setTextAlign('left')} className={`p-2 rounded ${textAlign === 'left' ? 'bg-blue-200' : 'hover:bg-gray-200'}`}><AlignLeft className="h-4 w-4" /></button>
              <button type="button" onClick={() => setTextAlign('center')} className={`p-2 rounded ${textAlign === 'center' ? 'bg-blue-200' : 'hover:bg-gray-200'}`}><AlignCenter className="h-4 w-4" /></button>
              <button type="button" onClick={() => setTextAlign('right')} className={`p-2 rounded ${textAlign === 'right' ? 'bg-blue-200' : 'hover:bg-gray-200'}`}><AlignRight className="h-4 w-4" /></button>

              <div className="w-px h-6 bg-gray-300" />

              <button type="button" onClick={() => insertTextAtCursor('• ')} className="p-2 hover:bg-gray-200 rounded"><List className="h-4 w-4" /></button>
              <button type="button" onClick={() => insertTextAtCursor('1. ')} className="p-2 hover:bg-gray-200 rounded"><ListOrdered className="h-4 w-4" /></button>

              <div className="w-px h-6 bg-gray-300" />

              {/* Couleur */}
              <div className="relative">
                <button type="button" onClick={() => setShowColorPicker(!showColorPicker)} className="p-2 rounded hover:bg-gray-200 flex items-center space-x-1">
                  <Palette className="h-4 w-4 text-gray-600" />
                  <div className="w-4 h-4 border border-gray-300 rounded" style={{ backgroundColor: textColor }} />
                </button>
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded p-3 shadow-lg z-10">
                    <div className="grid grid-cols-6 gap-2 mb-2">
                        {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB', '#A52A2A'].map((color) => (
                          <button
                          key={color}
                          type="button"
                          onClick={() => {
                            setTextColor(color);
                            setShowColorPicker(false);
                          }}
                          className="w-6 h-6 rounded border hover:scale-110 transition"
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

              {/* Emojis */}
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                  className="p-2 rounded hover:bg-gray-200"
                >
                  <Smile className="h-4 w-4 text-gray-600" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded p-3 shadow-lg z-10 w-64">
                    <div className="grid grid-cols-10 gap-1">
                      {popularEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            insertTextAtCursor(emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="text-lg hover:bg-gray-100 rounded p-1 transition"
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
            onChange={(e) => onUpdateMessage(e.target.value)}
            placeholder="Tapez votre message ici..."
            className="w-full h-64 p-4 border border-gray-300 border-t-0 rounded-b-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={getTextareaStyle()}
            onClick={() => {
              setShowColorPicker(false);
              setShowEmojiPicker(false);
            }}
            required
          />
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onSave}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-lg"
        >
          Sauvegarder
        </button>
        <div className="flex items-center space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-lg"
          >
             {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Envoi en cours...
              </div>
            ) : (
              'Envoyer'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition font-bold text-lg"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </form>
  );
};

export default MessageComposer;