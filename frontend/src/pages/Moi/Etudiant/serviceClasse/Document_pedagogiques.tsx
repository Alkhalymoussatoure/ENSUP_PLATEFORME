import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Star, CalendarDays, FileText, Download } from 'lucide-react';
import { useUserContext } from '../../../../hooks/useUserContext';

interface Document {
  id: number;
  titre: string;
  fichier: string | null;
  date_telechargement: string;
  type_fichier?: string;
}

interface BureauInfo {
  numero: string | null;
  batiment?: string;
  equipement?: string;
  responsables?: string;
}

interface EnseignantInfo {
  nom: string;
  photo: string | null;
  specialite?: string;
  departement?: string;
  telephone?: string;
  bureau?: BureauInfo | null;
}

interface SectionDocuments {
  section_id: number;
  cours: string;
  enseignant: EnseignantInfo;
  session: string;
  nb_documents: number;
  dernier_document: Document | null;
}

const DocumentsPedagogiques = () => {
  const { slug, token } = useUserContext();
  const [sectionDocs, setSectionDocs] = useState<SectionDocuments[]>([]);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [documentsParSection, setDocumentsParSection] = useState<Record<number, Document[]>>({});
  const [sectionTypeMap, setSectionTypeMap] = useState<Record<number, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    if (!slug || !token) return;

    fetch(`http://localhost:8000/api/${slug}/etudiant/documents-par-section/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erreur ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then(data => setSectionDocs(data))
      .catch(err => {
        console.error('Erreur chargement documents:', err);
        setErrorMessage('Impossible de charger les documents. Vérifiez votre connexion ou vos permissions.');
      });
  }, [slug, token]);

  useEffect(() => {
    if (expandedSection !== null) {
      toggleExpand(expandedSection);
    }
  }, [selectedType]);

  const toggleExpand = async (sectionId: number) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
      if (!documentsParSection[sectionId] || sectionTypeMap[sectionId] !== selectedType) {
        try {
          const res = await fetch(
            `http://localhost:8000/api/${slug}/etudiant/documents-par-section-details/?section_id=${sectionId}${selectedType ? `&type=${selectedType}` : ''}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Erreur ${res.status}: ${text}`);
          }
          const data = await res.json();
          setDocumentsParSection(prev => ({ ...prev, [sectionId]: data }));
          setSectionTypeMap(prev => ({ ...prev, [sectionId]: selectedType }));
        } catch (err) {
          console.error('Erreur chargement détails:', err);
          setErrorMessage('Impossible de charger les détails de la section. Veuillez réessayer.');
        }
      }
    }
  };

  const today = new Date().toLocaleDateString();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Documents et vidéos distribués</h2>
      <h4 className="text-sm text-gray-500">Sommaire des documents distribués en date du {today}</h4>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-2 rounded">
          {errorMessage}
        </div>
      )}

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-sm text-gray-700">
        <p>
          Vous retrouverez dans cette section les documents distribués par vos enseignants pour chaque section de vos cours.
          Pour accéder à la liste des documents d'une section, appuyez sur son titre.
          Les sections possédant des documents que vous n'avez pas encore récupérés sont identifiées par une <Star className="inline h-4 w-4 text-yellow-500" />.
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <label htmlFor="type-select" className="text-sm text-gray-700 font-medium">Filtrer par type :</label>
        <select
          id="type-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Tous</option>
          <option value="pdf">PDF</option>
          <option value="mp4">Vidéo</option>
          <option value="docx">Word</option>
          <option value="pptx">PowerPoint</option>
        </select>
      </div>

      <div className="space-y-4">
        {sectionDocs.map((sectionItem) => (
          <div key={sectionItem.section_id} className="border rounded-lg p-4 bg-gray-50">
            <div
              className="flex justify-between items-center cursor-pointer hover:bg-purple-100 p-2 rounded transition"
              onClick={() => toggleExpand(sectionItem.section_id)}
              aria-expanded={expandedSection === sectionItem.section_id}
            >
              <div className="flex items-center space-x-3">
                {sectionItem.enseignant.photo && (
                  <img
                    src={sectionItem.enseignant.photo}
                    alt={sectionItem.enseignant.nom}
                    className="h-10 w-10 rounded-full object-cover border"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-gray-800">{sectionItem.cours}</h4>
                  <p className="text-sm text-gray-600">
                    {sectionItem.session} — {sectionItem.enseignant.nom}
                  </p>
                  {sectionItem.enseignant.specialite && (
                    <p className="text-xs text-gray-500">Spécialité : {sectionItem.enseignant.specialite}</p>
                  )}
                  {sectionItem.enseignant.departement && (
                    <p className="text-xs text-gray-500">Département : {sectionItem.enseignant.departement}</p>
                  )}
                  {sectionItem.enseignant.bureau && (
                    <div className="mt-1 text-xs text-gray-500 space-y-1">
                      <p>Bureau : {sectionItem.enseignant.bureau.numero} ({sectionItem.enseignant.bureau.batiment})</p>
                      {sectionItem.enseignant.bureau.equipement && (
                        <p>Équipement : {sectionItem.enseignant.bureau.equipement}</p>
                      )}
                      {sectionItem.enseignant.bureau.responsables && (
                        <p>Responsables : {sectionItem.enseignant.bureau.responsables}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {expandedSection === sectionItem.section_id ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </div>

            <div className="text-sm text-gray-600 mt-2">
              {sectionItem.dernier_document ? (
                <>
                  <p className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>Dernier document : <strong>{sectionItem.dernier_document.titre}</strong></span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Total : {sectionItem.nb_documents} document(s)</span>
                  </p>
                </>
              ) : (
                <p>Aucun document disponible pour cette section.</p>
              )}
            </div>

            {expandedSection === sectionItem.section_id && documentsParSection[sectionItem.section_id] && (
              <div className="mt-4 space-y-2">
                {documentsParSection[sectionItem.section_id].map((doc) => (
                  <div key={doc.id} className="p-2 bg-white rounded border hover:shadow-sm transition">
                    <p className="font-medium text-gray-800">{doc.titre}</p>
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <CalendarDays className="h-4 w-4" />
                                            {new Date(doc.date_telechargement).toLocaleDateString()}
                    </p>
                    {doc.fichier && (
                      <a
                        href={doc.fichier}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Télécharger ${doc.titre}`}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1"
                      >
                        <Download className="h-4 w-4" />
                        Télécharger
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsPedagogiques;
