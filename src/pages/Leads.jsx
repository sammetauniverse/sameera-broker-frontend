import FileUploader from '../components/FileUploader';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { MapPin, CheckCircle, XCircle, FileText, Image as ImageIcon } from 'lucide-react';

export default function Leads() {
  const currentUser = localStorage.getItem('currentUser');
  const SHARED_KEY = 'SHARED_LEADS_DB';
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem(SHARED_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [viewingFiles, setViewingFiles] = useState(null);

  useEffect(() => { localStorage.setItem(SHARED_KEY, JSON.stringify(leads)); }, [leads]);

  const handleSaveLead = (leadData) => {
    setLeads([
      { ...leadData, id: `SL-${Math.floor(100000 + Math.random() * 900000)}`, createdBy: currentUser },
      ...leads,
    ]);
  };

  return (
    <Layout onLeadAdd={handleSaveLead}>
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Leads (All Users)</h1>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">User</th>
                <th className="p-4">Lead Name</th>
                <th className="p-4">Address</th>
                <th className="p-4">Google Pin</th>
                <th className="p-4">Price</th>
                <th className="p-4">Visit?</th>
                <th className="p-4">Converted?</th>
                <th className="p-4 text-center">Media</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.length > 0 ? leads.map(lead => (
                <tr key={lead.id}>
                  <td className="p-4 text-gray-500">{lead.date}</td>
                  <td className="p-4">{lead.createdBy}</td>
                  <td className="p-4">{lead.name}</td>
                  <td className="p-4">{lead.address}</td>
                  <td className="p-4">
                    <a href={
                      lead.googlePin && lead.googlePin.startsWith('http') ?
                        lead.googlePin : `https://maps.google.com/?q=${lead.googlePin}`
                    } target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline">
                      <MapPin size={12}/> Map
                    </a>
                  </td>
                  <td className="p-4">₹ {Number(lead.price).toLocaleString()}</td>
                  <td className="p-4 text-center">
                    {lead.siteVisitDone ? <CheckCircle size={18} className="text-green-500 mx-auto"/> : <XCircle size={18} className="text-gray-300 mx-auto"/>}
                  </td>
                  <td className="p-4 text-center">
                    {lead.isConverted || lead.converted ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-100">Yes</span>
                    ) : '-'}
                  </td>
                  <td className="p-4 text-center">
                    {lead.hasFiles && lead.files && lead.files.length > 0 ? (
                      <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded border text-gray-600 cursor-pointer" onClick={() => setViewingFiles(lead.files)}>
                        <ImageIcon size={12}/> {lead.files.length}
                      </span>
                    ) : <span className="text-gray-300">-</span>}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="9" className="p-12 text-center text-gray-500">No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* FILE MODAL */}
        {viewingFiles && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
              <h3 className="font-bold mb-3 text-lg">Uploaded Files</h3>
              <ul className="space-y-2">
                {viewingFiles.map((file, idx) => {
                  const fileObj = typeof file === "string" ? { name: file, url: null } : file;
                  const isImage = fileObj.url && fileObj.url.startsWith("data:image");
                  const isVideo = fileObj.url && fileObj.url.startsWith("data:video");
                  const canDownload = fileObj.url || fileObj.name;
                  return (
                    <li key={idx} className="flex items-center gap-2">
                      {isImage && (
                        <img src={fileObj.url} alt={fileObj.name} className="w-12 h-12 rounded shadow-md object-cover" />
                      )}
                      {isVideo && (
                        <video controls className="w-20 h-12 bg-black rounded">
                          <source src={fileObj.url} type="video/mp4" />
                          Your browser does not support video.
                        </video>
                      )}
                      {!isImage && !isVideo && <FileText size={20} />}
                      <span className="truncate max-w-[270px]">{fileObj.name}</span>
                      {canDownload && (
                        <a
                          href={fileObj.url ? fileObj.url : "#"}
                          download={fileObj.name}
                          className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs hover:bg-indigo-100"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Download"
                          style={{ textDecoration: "none" }}
                          onClick={
                            fileObj.url
                              ? undefined
                              : e => { e.preventDefault(); alert("File not available for direct download."); }
                          }
                        >
                          Download
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
              <button className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={() => setViewingFiles(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
