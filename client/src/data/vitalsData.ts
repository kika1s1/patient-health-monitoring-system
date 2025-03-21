
import { PatientVitals } from './types';
import { generateECGData, generateTimeSeriesData } from './dataGenerators';
import { patients } from './patientData';

// Generate vitals for first 10 patients
export const patientVitals: Record<string, PatientVitals> = {
  p1: {
    patientId: 'p1',
    temperature: {
      current: 37.2,
      unit: '°C',
      history: generateTimeSeriesData(37, 0.5, 24, 'stable'),
      status: 'normal',
      min: 36.5,
      max: 37.5
    },
    oxygenLevel: {
      current: 98,
      unit: '%',
      history: generateTimeSeriesData(97, 2, 24, 'stable'),
      status: 'normal',
      min: 95,
      max: 100
    },
    pulse: {
      current: 72,
      unit: 'bpm',
      history: generateTimeSeriesData(75, 10, 24, 'fluctuating'),
      status: 'normal',
      min: 60,
      max: 100
    },
    respirationRate: {
      current: 16,
      unit: "bpm",
      status: "normal",
      min: 12,
      max: 20,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
        value: 12 + Math.floor(Math.random() * 8)
      }))
    },
    ecg: {
      history: generateECGData('normal'),
      status: 'normal'
    }
  },
  p2: {
    patientId: 'p2',
    temperature: {
      current: 38.6,
      unit: '°C',
      history: generateTimeSeriesData(38.5, 0.8, 24, 'increasing'),
      status: 'warning',
      min: 36.5,
      max: 37.5
    },
    oxygenLevel: {
      current: 89,
      unit: '%',
      history: generateTimeSeriesData(88, 3, 24, 'decreasing'),
      status: 'critical',
      min: 95,
      max: 100
    },
    pulse: {
      current: 112,
      unit: 'bpm',
      history: generateTimeSeriesData(110, 15, 24, 'increasing'),
      status: 'critical',
      min: 60,
      max: 100
    },
    respirationRate: {
      current: 25,
      unit: "bpm",
      status: "critical",
      min: 12,
      max: 20,
      history: generateTimeSeriesData(24, 3, 24, 'increasing')
    },
    ecg: {
      history: generateECGData('critical'),
      status: 'critical'
    }
  },
  p3: {
    patientId: 'p3',
    temperature: {
      current: 37.9,
      unit: '°C',
      history: generateTimeSeriesData(37.8, 0.6, 24, 'increasing'),
      status: 'warning',
      min: 36.5,
      max: 37.5
    },
    oxygenLevel: {
      current: 93,
      unit: '%',
      history: generateTimeSeriesData(94, 2, 24, 'fluctuating'),
      status: 'warning',
      min: 95,
      max: 100
    },
    pulse: {
      current: 88,
      unit: 'bpm',
      history: generateTimeSeriesData(85, 8, 24, 'stable'),
      status: 'normal',
      min: 60,
      max: 100
    },
    respirationRate: {
      current: 19,
      unit: "bpm",
      status: "warning",
      min: 12,
      max: 20,
      history: generateTimeSeriesData(18, 2, 24, 'fluctuating')
    },
    ecg: {
      history: generateECGData('irregular'),
      status: 'warning'
    }
  },
  p4: {
    patientId: 'p4',
    temperature: {
      current: 36.9,
      unit: '°C',
      history: generateTimeSeriesData(36.8, 0.3, 24, 'stable'),
      status: 'normal',
      min: 36.5,
      max: 37.5
    },
    oxygenLevel: {
      current: 97,
      unit: '%',
      history: generateTimeSeriesData(98, 1, 24, 'stable'),
      status: 'normal',
      min: 95,
      max: 100
    },
    pulse: {
      current: 65,
      unit: 'bpm',
      history: generateTimeSeriesData(67, 5, 24, 'fluctuating'),
      status: 'normal',
      min: 60,
      max: 100
    },
    respirationRate: {
      current: 15,
      unit: "bpm",
      status: "normal",
      min: 12,
      max: 20,
      history: generateTimeSeriesData(15, 1.5, 24, 'stable')
    },
    ecg: {
      history: generateECGData('normal'),
      status: 'normal'
    }
  },
  p5: {
    patientId: 'p5',
    temperature: {
      current: 37.1,
      unit: '°C',
      history: generateTimeSeriesData(37, 0.4, 24, 'stable'),
      status: 'normal',
      min: 36.5,
      max: 37.5
    },
    oxygenLevel: {
      current: 99,
      unit: '%',
      history: generateTimeSeriesData(98, 1.5, 24, 'stable'),
      status: 'normal',
      min: 95,
      max: 100
    },
    pulse: {
      current: 82,
      unit: 'bpm',
      history: generateTimeSeriesData(80, 7, 24, 'fluctuating'),
      status: 'normal',
      min: 60,
      max: 100
    },
    respirationRate: {
      current: 14,
      unit: "bpm",
      status: "normal",
      min: 12,
      max: 20,
      history: generateTimeSeriesData(14, 1, 24, 'stable')
    },
    ecg: {
      history: generateECGData('normal'),
      status: 'normal'
    }
  },
  p6: {
    patientId: 'p6',
    temperature: {
      current: 37.4,
      unit: '°C',
      history: generateTimeSeriesData(37.3, 0.4, 24, 'stable'),
      status: 'normal',
      min: 36.5,
      max: 37.5
    },
    oxygenLevel: {
      current: 94,
      unit: '%',
      history: generateTimeSeriesData(95, 2.5, 24, 'fluctuating'),
      status: 'warning',
      min: 95,
      max: 100
    },
    pulse: {
      current: 85,
      unit: 'bpm',
      history: generateTimeSeriesData(82, 9, 24, 'increasing'),
      status: 'normal',
      min: 60,
      max: 100
    },
    respirationRate: {
      current: 17,
      unit: "bpm",
      status: "normal",
      min: 12,
      max: 20,
      history: generateTimeSeriesData(17, 2, 24, 'fluctuating')
    },
    ecg: {
      history: generateECGData('irregular'),
      status: 'warning'
    }
  },
  p7: {
    patientId: 'p7',
    temperature: {
      current: 36.8,
      unit: '°C',
      history: generateTimeSeriesData(36.9, 0.3, 24, 'stable'),
      status: 'normal',
      min: 36.5,
      max: 37.5
    },
    oxygenLevel: {
      current: 97,
      unit: '%',
      history: generateTimeSeriesData(97.5, 1, 24, 'stable'),
      status: 'normal',
      min: 95,
      max: 100
    },
    pulse: {
      current: 76,
      unit: 'bpm',
      history: generateTimeSeriesData(75, 5, 24, 'fluctuating'),
      status: 'normal',
      min: 60,
      max: 100
    },
    respirationRate: {
      current: 15,
      unit: "bpm",
      status: "normal",
      min: 12,
      max: 20,
      history: generateTimeSeriesData(15, 1, 24, 'stable')
    },
    ecg: {
      history: generateECGData('normal'),
      status: 'normal'
    }
  },
  p8: {
    patientId: 'p8',
    temperature: {
      current: 39.1,
      unit: '°C',
      history: generateTimeSeriesData(38.8, 0.7, 24, 'increasing'),
      status: 'critical',
      min: 36.5,
      max: 37.5
    },
    oxygenLevel: {
      current: 87,
      unit: '%',
      history: generateTimeSeriesData(89, 4, 24, 'decreasing'),
      status: 'critical',
      min: 95,
      max: 100
    },
    pulse: {
      current: 118,
      unit: 'bpm',
      history: generateTimeSeriesData(115, 12, 24, 'increasing'),
      status: 'critical',
      min: 60,
      max: 100
    },
    respirationRate: {
      current: 28,
      unit: "bpm",
      status: "critical",
      min: 12,
      max: 20,
      history: generateTimeSeriesData(26, 4, 24, 'increasing')
    },
    ecg: {
      history: generateECGData('critical'),
      status: 'critical'
    }
  },
  p9: {
    patientId: 'p9',
    temperature: {
      current: 37.0,
      unit: '°C',
      history: generateTimeSeriesData(37.1, 0.3, 24, 'stable'),
      status: 'normal',
      min: 36.5,
      max: 37.5
    },
    oxygenLevel: {
      current: 98,
      unit: '%',
      history: generateTimeSeriesData(98, 1.2, 24, 'stable'),
      status: 'normal',
      min: 95,
      max: 100
    },
    pulse: {
      current: 74,
      unit: 'bpm',
      history: generateTimeSeriesData(73, 7, 24, 'fluctuating'),
      status: 'normal',
      min: 60,
      max: 100
    },
    respirationRate: {
      current: 14,
      unit: "bpm",
      status: "normal",
      min: 12,
      max: 20,
      history: generateTimeSeriesData(14, 1, 24, 'stable')
    },
    ecg: {
      history: generateECGData('normal'),
      status: 'normal'
    }
  },
  p10: {
    patientId: 'p10',
    temperature: {
      current: 37.7,
      unit: '°C',
      history: generateTimeSeriesData(37.5, 0.5, 24, 'increasing'),
      status: 'warning',
      min: 36.5,
      max: 37.5
    },
    oxygenLevel: {
      current: 92,
      unit: '%',
      history: generateTimeSeriesData(93, 2, 24, 'fluctuating'),
      status: 'warning',
      min: 95,
      max: 100
    },
    pulse: {
      current: 90,
      unit: 'bpm',
      history: generateTimeSeriesData(87, 8, 24, 'increasing'),
      status: 'normal',
      min: 60,
      max: 100
    },
    respirationRate: {
      current: 19,
      unit: "bpm",
      status: "warning",
      min: 12,
      max: 20,
      history: generateTimeSeriesData(18, 2, 24, 'increasing')
    },
    ecg: {
      history: generateECGData('irregular'),
      status: 'warning'
    }
  }
};

// Generate remaining vitals data dynamically based on patient status
patients.forEach((patient) => {
  const patientId = patient.id;
  
  // If patient vitals don't already exist, generate them
  if (!patientVitals[patientId]) {
    let tempBase, oxyBase, pulseBase, respBase, ecgType;
    let tempPattern: 'stable' | 'increasing' | 'decreasing' | 'fluctuating' = 'stable';
    let oxyPattern: 'stable' | 'increasing' | 'decreasing' | 'fluctuating' = 'stable';
    let pulsePattern: 'stable' | 'increasing' | 'decreasing' | 'fluctuating' = 'fluctuating';
    let respPattern: 'stable' | 'increasing' | 'decreasing' | 'fluctuating' = 'stable';
    
    if (patient.status === 'critical') {
      tempBase = 38.5 + Math.random() * 1;
      oxyBase = 87 + Math.random() * 3;
      pulseBase = 110 + Math.random() * 15;
      respBase = 22 + Math.random() * 8; // Higher respiration for critical patients
      ecgType = 'critical';
      tempPattern = 'increasing';
      oxyPattern = 'decreasing';
      pulsePattern = 'increasing';
      respPattern = 'increasing';
    } else if (patient.status === 'warning') {
      tempBase = 37.6 + Math.random() * 0.6;
      oxyBase = 92 + Math.random() * 3;
      pulseBase = 85 + Math.random() * 10;
      respBase = 18 + Math.random() * 4; // Moderate respiration for warning patients
      ecgType = 'irregular';
      tempPattern = Math.random() > 0.5 ? 'increasing' : 'fluctuating';
      oxyPattern = Math.random() > 0.5 ? 'decreasing' : 'fluctuating';
      pulsePattern = Math.random() > 0.5 ? 'increasing' : 'fluctuating';
      respPattern = Math.random() > 0.5 ? 'fluctuating' : 'increasing';
    } else {
      tempBase = 36.6 + Math.random() * 0.7;
      oxyBase = 96 + Math.random() * 3;
      pulseBase = 65 + Math.random() * 15;
      respBase = 14 + Math.random() * 4; // Normal respiration
      ecgType = 'normal';
      tempPattern = 'stable';
      oxyPattern = 'stable';
      pulsePattern = 'fluctuating';
      respPattern = 'stable';
    }
    
    patientVitals[patientId] = {
      patientId,
      temperature: {
        current: Number(tempBase.toFixed(1)),
        unit: '°C',
        history: generateTimeSeriesData(tempBase, 0.5, 24, tempPattern),
        status: tempBase > 38 ? 
          (tempBase > 38.5 ? 'critical' : 'warning') : 
          (tempBase < 36 ? 'warning' : 'normal'),
        min: 36.5,
        max: 37.5
      },
      oxygenLevel: {
        current: Number(oxyBase.toFixed(0)),
        unit: '%',
        history: generateTimeSeriesData(oxyBase, 2, 24, oxyPattern),
        status: oxyBase < 90 ? 'critical' : (oxyBase < 95 ? 'warning' : 'normal'),
        min: 95,
        max: 100
      },
      pulse: {
        current: Number(pulseBase.toFixed(0)),
        unit: 'bpm',
        history: generateTimeSeriesData(pulseBase, 8, 24, pulsePattern),
        status: pulseBase > 100 ? 'critical' : (pulseBase > 90 ? 'warning' : 'normal'),
        min: 60,
        max: 100
      },
      respirationRate: {
        current: Number(respBase.toFixed(0)),
        unit: 'bpm',
        history: generateTimeSeriesData(respBase, 2, 24, respPattern),
        status: respBase > 20 ? 'critical' : (respBase > 18 ? 'warning' : 'normal'),
        min: 12,
        max: 20
      },
      ecg: {
        history: generateECGData(ecgType as 'normal' | 'irregular' | 'critical'),
        status: patient.status
      }
    };
  }
});
