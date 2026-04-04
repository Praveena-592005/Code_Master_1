import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
const CertificateModal = ({ isOpen, onClose, userName, courseName, certId }) => {
    const certRef = useRef();
    if (!isOpen) return null;
    const downloadPDF = (e) => {
        e.stopPropagation();
        const input = certRef.current;
        html2canvas(input, { 
            scale: 3, 
            useCORS: true,
            logging: false,
            letterRendering: true
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${courseName.replace(/\s+/g, '_')}_Certificate.pdf`);
        });
    };
    const handleClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    };
    return (
        <div 
            onClick={onClose}
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100vw', 
                height: '100vh', 
                backgroundColor: 'rgba(0,0,0,0.9)', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                zIndex: 9999, 
                padding: '20px' 
            }}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                style={{ 
                    backgroundColor: 'transparent', 
                    padding: '20px', 
                    textAlign: 'center', 
                    position: 'relative'
                }}
            >
                <div ref={certRef} style={{ 
                    width: '900px', 
                    height: '630px', 
                    padding: '20px', 
                    background: '#fff', 
                    border: '15px solid #3b82f6', 
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ 
                        border: '2px solid #3b82f6', 
                        flex: 1, 
                        padding: '40px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <h2 style={{ margin: 0, fontFamily: "'Brush Script MT', cursive", fontSize: '42px', color: '#000' }}>CodeMaster</h2>
                        <h1 style={{ fontSize: '48px', color: '#000', margin: '10px 0', fontWeight: '900', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>CERTIFICATE OF ACHIEVEMENT</h1>
                        <p style={{ fontSize: '18px', color: '#444', margin: '0' }}>This certificate is proudly presented to</p>
                        <h2 style={{ fontSize: '80px', margin: '15px 0', color: '#3b82f6', fontFamily: "'Brush Script MT', cursive" }}>{userName}</h2>
                        <p style={{ fontSize: '18px', color: '#333', maxWidth: '700px', textAlign: 'center', lineHeight: '1.5' }}>
                            We certify that this user has successfully completed all requirements 
                            and demonstrated proficiency in the <strong>{courseName}</strong> curriculum.
                        </p>
                        <div style={{ marginTop: '30px', fontSize: '14px', color: '#666', width: '100%', display: 'flex', justifyContent: 'center', padding: '0 50px' }}>
                            <span>Verify ID: {certId}</span>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <button 
                        onClick={downloadPDF} 
                        style={{ 
                            padding: '12px 35px', 
                            backgroundColor: '#3b82f6', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '50px', 
                            cursor: 'pointer', 
                            fontWeight: 'bold', 
                            fontSize: '16px',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                        }}
                    >
                        Download PDF
                    </button>
                    <button 
                        onClick={handleClose} 
                        style={{ 
                            padding: '12px 35px', 
                            backgroundColor: '#ffffff', 
                            color: '#333', 
                            border: '1px solid #ddd', 
                            borderRadius: '50px', 
                            cursor: 'pointer', 
                            fontWeight: 'bold', 
                            fontSize: '16px',
                            boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
export default CertificateModal;