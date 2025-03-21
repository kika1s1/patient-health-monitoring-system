
import { Patient } from './types';

export const patients: Patient[] = [
  {
    id: 'p1',
    name: 'Lensa Teshome',
    age: 45,
    gender: 'Female',
    status: 'normal',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    room: '101',
    condition: 'Post-surgery recovery',
    additionalInfo: 'Patient recovering well after appendectomy, monitoring for infection',
    recentVisits: [
      {
        date: '2025-05-15',
        reason: 'Post-surgical follow-up',
        doctor: 'Dr. Mekonnen'
      },
      {
        date: '2025-05-10',
        reason: 'Surgery - Appendectomy',
        doctor: 'Dr. Tadesse'
      }
    ]
  },
  {
    id: 'p2',
    name: 'Kebede Alemu',
    age: 67,
    gender: 'Male',
    status: 'critical',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    room: '203',
    condition: 'Cardiac monitoring'
  },
  {
    id: 'p3',
    name: 'Meklit Habte',
    age: 28,
    gender: 'Female',
    status: 'warning',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    condition: 'Pneumonia',
    location: {
      address: '345 Meskel Square',
      city: 'Addis Ababa',
      state: 'Oromia',
      zipCode: '10012',
      coordinates: { lat: 9.005401, lng: 38.763611 },
      inHospital: false
    }
  },
  {
    id: 'p4',
    name: 'Eyob Bekele',
    age: 54,
    gender: 'Male',
    status: 'normal',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    room: '110',
    condition: 'Routine monitoring'
  },
  {
    id: 'p5',
    name: 'Sara Tesfaye',
    age: 32,
    gender: 'Female',
    status: 'normal',
    avatar: 'https://randomuser.me/api/portraits/women/89.jpg',
    condition: 'Pregnancy monitoring',
    location: {
      address: '72 Bole Road',
      city: 'Addis Ababa',
      state: 'Addis Ababa',
      zipCode: '10045',
      coordinates: { lat: 9.017012, lng: 38.788792 },
      inHospital: false
    }
  },
  {
    id: 'p6',
    name: 'Getahun Mulugeta',
    age: 72,
    gender: 'Male',
    status: 'warning',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    room: '145',
    condition: 'Hypertension'
  },
  {
    id: 'p7',
    name: 'Hiwot Degu',
    age: 41,
    gender: 'Female',
    status: 'normal',
    avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    room: '112',
    condition: 'Diabetes monitoring'
  },
  {
    id: 'p8',
    name: 'Yonas Fikru',
    age: 59,
    gender: 'Male',
    status: 'critical',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    room: '207',
    condition: 'Respiratory failure'
  },
  {
    id: 'p9',
    name: 'Bethel Assefa',
    age: 36,
    gender: 'Female',
    status: 'normal',
    avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
    room: '124',
    condition: 'Post-operative care'
  },
  {
    id: 'p10',
    name: 'Samuel Tadesse',
    age: 63,
    gender: 'Male',
    status: 'warning',
    avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
    room: '131',
    condition: 'Chronic heart failure'
  }
];

// Add location data to all patients
patients.forEach(patient => {
  if (!patient.location) {
    // Ethiopian cities
    const ethiopianCities = [
      'Addis Ababa', 'Dire Dawa', 'Hawassa', 'Bahir Dar', 'Mekelle', 
      'Adama', 'Gondar', 'Jimma', 'Dessie', 'Debre Birhan'
    ];
    
    // Ethiopian states
    const ethiopianStates = [
      'Addis Ababa', 'Oromia', 'Amhara', 'Tigray', 'SNNP', 
      'Afar', 'Somali', 'Benishangul-Gumuz', 'Sidama', 'Harari'
    ];
    
    // Ethiopian street names
    const ethiopianStreets = [
      'Bole Road', 'Churchill Avenue', 'Meskel Square', 'Africa Avenue', 'Menelik II Avenue',
      'Arat Kilo', 'Piazza', 'Kazanchis', 'Stadium Road', 'University Road'
    ];
    
    patient.location = {
      address: `${Math.floor(Math.random() * 999) + 100} ${ethiopianStreets[Math.floor(Math.random() * ethiopianStreets.length)]}`,
      city: ethiopianCities[Math.floor(Math.random() * ethiopianCities.length)],
      state: ethiopianStates[Math.floor(Math.random() * ethiopianStates.length)],
      zipCode: `${10000 + Math.floor(Math.random() * 90000)}`,
      coordinates: { 
        lat: 9.145 + (Math.random() - 0.5) * 2,  // Ethiopia approximate coordinates
        lng: 38.765 + (Math.random() - 0.5) * 2
      },
      inHospital: patient.room !== undefined || patient.status === 'critical' || Math.random() > 0.7
    };
  }
});
