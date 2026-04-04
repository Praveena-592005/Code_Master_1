import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const MilestoneCertificateModal = ({ isOpen, onClose, userName, milestoneName, certId, badgeImg }) => {
    const certificateRef = useRef();
    if (!isOpen) return null;
    const downloadCertificate = (e) => {
        e.stopPropagation();
        const input = certificateRef.current;
        html2canvas(input, { 
            scale: 3, 
            useCORS: true,
            backgroundColor: '#1a1a1a' 
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', [105, 160]); 
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${milestoneName}_Badge.pdf`);
        });
    };
    return (
        <div 
            onClick={onClose}
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                backgroundColor: 'rgba(0,0,0,0.9)', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                zIndex: 2500, 
                padding: '20px' 
            }}
        >
            <div 
                ref={certificateRef}
                onClick={(e) => e.stopPropagation()}
                style={{ 
                    width: '380px', 
                    background: 'linear-gradient(180deg, #2c2c2c 0%, #121212 100%)', 
                    padding: '40px 30px', 
                    borderRadius: '24px', 
                    textAlign: 'center', 
                    position: 'relative', 
                    color: '#fff', 
                    boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
                    pointerEvents: 'none'
                }} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#888', letterSpacing: '2px', marginBottom: '40px' }}>
                        CODEMASTER ACHIEVEMENT
                    </div>
                    <p style={{ fontSize: '18px', color: '#ccc', margin: '0 0 10px 0' }}>Congratulations,</p>
                    <h2 style={{ fontSize: '28px', color: '#fff', margin: '0 0 40px 0', fontWeight: '700' }}>{userName}</h2>
                    <div style={{ position: 'relative', marginBottom: '40px' }}>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '180px',
                            height: '180px',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
                        }} />
                        <img 
                            src={badgeImg} 
                            alt="Badge" 
                            style={{ 
                                width: '160px', 
                                height: '160px', 
                                objectFit: 'contain',
                                position: 'relative',
                                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
                            }} 
                        />
                    </div>
                    <h1 style={{ fontSize: '24px', color: '#ffd700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px 0' }}>
                        {milestoneName} BADGE
                    </h1>
                    <p style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.6', marginBottom: '40px', padding: '0 10px' }}>
                        For successfully completing the challenges required to reach this milestone on the CodeMaster platform.
                    </p>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase' }}>Verification ID</div>
                            <div style={{ fontSize: '12px', color: '#999' }}>{certId}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                <button 
                    onClick={downloadCertificate} 
                    style={{ 
                        background: '#ffa116', 
                        color: 'white', 
                        border: 'none', 
                        padding: '12px 40px', 
                        borderRadius: '50px', 
                        cursor: 'pointer', 
                        fontWeight: '600', 
                        fontSize: '16px',
                        transition: 'transform 0.2s',
                        boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)'
                    }}
                >
                    Download
                </button>
                <button 
                    onClick={onClose} 
                    style={{ 
                        background: 'rgba(255,255,255,0.1)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '12px 40px', 
                        borderRadius: '50px', 
                        cursor: 'pointer', 
                        fontWeight: '600', 
                        fontSize: '16px',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};
export default MilestoneCertificateModal;