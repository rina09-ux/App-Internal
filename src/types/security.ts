export type SecurityClearance = 'Q-Clearance' | 'Top Secret (SCI)' | 'Secret' | 'Confidential' | 'Public Trust';

export type AlgorithmFamily = 
  | 'ML-KEM (Kyber)' 
  | 'ML-DSA (Dilithium)' 
  | 'SLH-DSA (SPHINCS+)' 
  | 'Falcon' 
  | 'LMS/XMSS' 
  | 'RSA (Legacy)' 
  | 'ECC/ECDSA (Legacy)' 
  | 'Hybrid PQC-ECC';

export type QuantumRiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'QUANTUM_SAFE';

export interface CryptoAsset {
  id: string;
  name: string;
  type: 'TLS Certificate' | 'SSH Host Key' | 'VPN Tunnel' | 'Code Signing Key' | 'HSM Master Root' | 'Database Column Key';
  environment: 'Production AWS' | 'Core Data Center' | 'Edge Gateway' | 'Kubernetes Cluster' | 'Internal Banking API';
  currentAlgorithm: string;
  family: AlgorithmFamily;
  keySize: number | string;
  riskLevel: QuantumRiskLevel;
  pqcTargetAlgorithm: string;
  migrationStatus: 'Legacy Vulnerable' | 'In Hybrid Transition' | 'PQC Validated' | 'Quarantined';
  expiresAt: string;
  hndlRisk: 'Extreme' | 'High' | 'Moderate' | 'Protected';
  ownerTeam: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  source: string;
  targetEndpoint: string;
  detectedAt: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'HNDL Exfiltration Attempt' | 'Anomalous Cryptanalysis Spikes' | 'Weak Entropy Warning' | 'Legacy TLS Downgrade' | 'QKD Optical QBER Spike';
  status: 'Investigating' | 'Contained' | 'Mitigated' | 'False Positive';
  assignedOfficer: string;
  mitigationRecommendation: string;
}

export interface QKDNode {
  id: string;
  nodeName: string;
  location: string;
  protocol: 'BB84 (Decoy-State)' | 'E91 (Entanglement)' | 'COW (Coherent One-Way)';
  qberPercent: number; // Quantum Bit Error Rate (safe < 4.5%)
  photonRateHz: string; // e.g. "2.4 MHz"
  keyPoolCount: number;
  status: 'ONLINE_OPTIMAL' | 'DEGRADED' | 'CALIBRATING' | 'OFFLINE';
  connectedPeers: string[];
}

export interface ComplianceMilestone {
  id: string;
  standard: 'NIST FIPS 203 (ML-KEM)' | 'NIST FIPS 204 (ML-DSA)' | 'NIST FIPS 205 (SLH-DSA)' | 'NSA CNSA 2.0' | 'BSI TR-02102' | 'ISO/IEC PQC';
  deadline: string;
  completionPercentage: number;
  status: 'Compliant' | 'On Track' | 'At Risk' | 'Pending Phase 2';
  requiredScope: string;
}

export interface QuantumLabProject {
  id: string;
  title: string;
  leadResearcher: string;
  category: 'Lattice Cryptanalysis' | 'Side-Channel Fault Testing' | 'Hybrid TLS 1.3 Benchmark' | 'Photonic QKD Repeaters';
  progress: number;
  benchmarkResult: string;
  status: 'Active Lab Run' | 'Peer Review' | 'Standardized';
}
