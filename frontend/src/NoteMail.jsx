import React, { useState, useEffect } from 'react';
import { Mail, Send, AlertTriangle, Flame, Check, ArrowLeft, ExternalLink } from 'lucide-react';
import axios from 'axios';

const NOTEMAIL_API = 'http://localhost:5001/api/notemail';
const TEMPMAIL_API = 'http://localhost:5000/api';

function NoteMail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Note data
  const [noteId, setNoteId] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [noteContent, setNoteContent] = useState(null);
  const [destroyed, setDestroyed] = useState(false);
  
  // Reply state
  const [showReply, setShowReply] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replySent, setReplySent] = useState(false);

  // Extract note ID and key from URL on load
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    // Check if viewing a specific note
    if (path.startsWith('/notemail/') && path !== '/notemail' && hash) {
      const id = path.split('/notemail/')[1];
      const key = hash.substring(1);
      
      if (id && key) {
        setNoteId(id);
        setEncryptionKey(key);
        // Auto-load note
        viewNote(id, key);
      }
    }
  }, []);

  // View the note
  const viewNote = async (id, key) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${NOTEMAIL_API}/view/${id}`, {
        key: key
      });

      setNoteContent(response.data.content);
      setDestroyed(response.data.metadata.willDestroy);
      
      // Set reply subject
      const originalSubject = response.data.content.subject;
      setReplySubject(originalSubject.startsWith('Re: ') ? originalSubject : `Re: ${originalSubject}`);
      
    } catch (err) {
      setError(err.response?.data?.message || 'This note has been destroyed or never existed.');
    } finally {
      setLoading(false);
    }
  };

  // Send reply back to TempMail inbox
  const sendReply = async () => {
    if (!replyMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send reply to the original TempMail inbox
      await axios.post(`${TEMPMAIL_API}/reply`, {
        to: noteContent.replyTo,
        from: 'Anonymous Reply',
        subject: replySubject,
        body: replyMessage
      });

      setReplySent(true);
      setShowReply(false);
      
    } catch (err) {
      setError('Failed to send reply. The email may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2.5 rounded-lg">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  NoteMail
                </h1>
                <p className="text-xs text-gray-500">Self-Destructing Email</p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">TempMail</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Home Page - No note ID */}
        {!noteId && !loading && (
          <div className="text-center">
            <div className="mb-8">
              <Flame className="w-24 h-24 text-purple-600 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Share Emails That <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Self-Destruct</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Turn any email into a secure, one-time-view note that automatically destroys itself after being read.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Go to TempMail
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Flame className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Self-Destruct</h3>
                <p className="text-sm text-gray-600">Notes destroy after being read once</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Mail className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Anonymous Replies</h3>
                <p className="text-sm text-gray-600">Recipients can reply back to your inbox</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Encrypted</h3>
                <p className="text-sm text-gray-600">End-to-end AES-256 encryption</p>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">1</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Receive Email</h4>
                  <p className="text-sm text-gray-600">Get an email in your TempMail inbox from any source</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-pink-600">2</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Share as NoteMail</h4>
                  <p className="text-sm text-gray-600">Click the purple share button to create a secure link</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-red-600">3</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Recipient Views</h4>
                  <p className="text-sm text-gray-600">They see the email once, then it's destroyed forever</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">4</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Get Reply</h4>
                  <p className="text-sm text-gray-600">They can reply back anonymously to your TempMail</p>
                </div>
              </div>
            </div>

            {/* Why Use NoteMail Section */}
            <div className="mt-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Use NoteMail?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Flame className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Maximum Privacy</h4>
                      <p className="text-sm text-gray-600">
                        Share sensitive information without leaving a permanent trace. Perfect for confidential communications.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Zero Knowledge</h4>
                      <p className="text-sm text-gray-600">
                        Even we can't read your notes. Encryption key never reaches our servers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Send className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Two-Way Communication</h4>
                      <p className="text-sm text-gray-600">
                        Recipients can reply back to your TempMail inbox without knowing your real email.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">No Registration</h4>
                      <p className="text-sm text-gray-600">
                        No sign-up required. Just share emails instantly and securely.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Use Cases Section */}
            <div className="mt-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Perfect For These Scenarios</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Use Cases */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Sharing Verification Codes</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Received an OTP or verification code? Share it securely with someone who needs it without exposing your email.
                  </p>
                  <div className="text-xs text-purple-700 font-semibold">
                    ✓ One-time view • ✓ Auto-destroy
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Job Applications</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Share interview confirmations or offer letters with family/friends without forwarding from your professional email.
                  </p>
                  <div className="text-xs text-blue-700 font-semibold">
                    ✓ Private • ✓ No forwarding needed
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Temporary Access</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Share login credentials, API keys, or temporary passwords that should only be viewed once and then destroyed.
                  </p>
                  <div className="text-xs text-green-700 font-semibold">
                    ✓ Secure • ✓ Self-destruct
                  </div>
                </div>

                {/* Business Use Cases */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Client Communications</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Share sensitive client emails with team members without creating permanent copies or email trails.
                  </p>
                  <div className="text-xs text-orange-700 font-semibold">
                    ✓ Team sharing • ✓ No email trail
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Confidential Documents</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Share contracts, NDAs, or confidential agreements that should be viewed once and not stored permanently.
                  </p>
                  <div className="text-xs text-red-700 font-semibold">
                    ✓ Confidential • ✓ No storage
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-6 rounded-xl border border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Customer Support</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Share customer emails with support team for one-time review without creating permanent records in multiple inboxes.
                  </p>
                  <div className="text-xs text-indigo-700 font-semibold">
                    ✓ Support team • ✓ Privacy-first
                  </div>
                </div>

                {/* Developer Use Cases */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Testing Email Flows</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Share test emails with QA team or developers for debugging without cluttering real inboxes.
                  </p>
                  <div className="text-xs text-teal-700 font-semibold">
                    ✓ Testing • ✓ Clean workflow
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">API Responses</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Share webhook or API response emails with developers for one-time debugging without permanent storage.
                  </p>
                  <div className="text-xs text-yellow-700 font-semibold">
                    ✓ Debug • ✓ Temporary
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Error Notifications</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Share system error emails or alerts with team members for immediate review without permanent records.
                  </p>
                  <div className="text-xs text-pink-700 font-semibold">
                    ✓ Alerts • ✓ Instant sharing
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-bold text-gray-900 mb-2">How does NoteMail work?</h4>
                  <p className="text-sm text-gray-600">
                    NoteMail encrypts your email content with AES-256 encryption. The encryption key is stored in the URL fragment (after #) which never reaches our servers. When someone opens the link, the note is decrypted in their browser and immediately destroyed on our servers.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-bold text-gray-900 mb-2">Can I view a note more than once?</h4>
                  <p className="text-sm text-gray-600">
                    No. Notes are designed to self-destruct after being viewed once. This ensures maximum privacy and security. Once viewed, the note is permanently deleted and cannot be recovered.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-bold text-gray-900 mb-2">How long do notes last?</h4>
                  <p className="text-sm text-gray-600">
                    Notes automatically expire after 24 hours if not viewed. However, they will be destroyed immediately after the first view, whichever comes first.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-bold text-gray-900 mb-2">Is it really secure?</h4>
                  <p className="text-sm text-gray-600">
                    Yes! We use military-grade AES-256-CBC encryption. The encryption key is stored in the URL fragment (after #) which is never sent to our servers. This means we have zero knowledge of your note's content.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-bold text-gray-900 mb-2">Can recipients reply to me?</h4>
                  <p className="text-sm text-gray-600">
                    Yes! Recipients can click "Write a Reply" to send an anonymous message back to your TempMail inbox. They won't see your real email address, maintaining your privacy.
                  </p>
                </div>

                <div className="pb-6">
                  <h4 className="font-bold text-gray-900 mb-2">What happens if I lose the link?</h4>
                  <p className="text-sm text-gray-600">
                    If you lose the NoteMail link, there's no way to recover it. The note can only be accessed through the original link. Make sure to share it with the intended recipient before losing it.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Share Securely?</h3>
              <p className="text-lg mb-8 opacity-90">
                Start with TempMail to receive and share emails that self-destruct
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Get Started with TempMail
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !noteContent && (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 shadow-lg text-center">
            <Flame className="w-16 h-16 text-purple-600 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading note...</p>
          </div>
        )}

        {/* Error State */}
        {error && !noteContent && noteId && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Note Not Found</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to TempMail
              </button>
            </div>
          </div>
        )}

        {/* Note Content */}
        {noteContent && !showReply && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            {/* Destruction Warning */}
            {destroyed && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start space-x-3">
                <Flame className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-900 font-semibold">This note has been destroyed</p>
                  <p className="text-red-700 text-sm mt-1">
                    This message will no longer be accessible. Save any important information now.
                  </p>
                </div>
              </div>
            )}

            {/* Email Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{noteContent.subject}</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <span className="font-semibold text-gray-600 min-w-[80px]">From:</span>
                  <span className="text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg flex-1">
                    {noteContent.from}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold text-gray-600 min-w-[80px]">To:</span>
                  <span className="text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg font-mono text-xs flex-1">
                    {noteContent.to}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold text-gray-600 min-w-[80px]">Date:</span>
                  <span className="text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg flex-1">
                    {new Date(noteContent.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {noteContent.body}
                </p>
              </div>
            </div>

            {/* Reply Section */}
            {!replySent && noteContent.replyTo && (
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-purple-600" />
                    Want to reply?
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Send a message back to the sender's temporary inbox
                  </p>
                  <button
                    onClick={() => setShowReply(true)}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Write a Reply</span>
                  </button>
                </div>
              </div>
            )}

            {/* Reply Sent Confirmation */}
            {replySent && (
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-green-50 rounded-lg p-6 border border-green-200 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reply Sent!</h3>
                  <p className="text-gray-600 text-sm">
                    Your message has been delivered to the sender's temporary inbox.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reply Form */}
        {showReply && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Write Your Reply</h2>
              <button
                onClick={() => setShowReply(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  rows="8"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
                />
              </div>

              <div className="flex items-start space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Your reply will be sent anonymously to the sender's temporary inbox. They will receive it as a new email.
                </p>
              </div>

              <button
                onClick={sendReply}
                disabled={loading || !replyMessage.trim()}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{loading ? 'Sending...' : 'Send Reply'}</span>
              </button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 pt-8 text-center">
          <p className="text-sm text-gray-600">
            <strong>NoteMail</strong> - Secure, self-destructing email sharing
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This note has been destroyed and cannot be viewed again.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default NoteMail;
