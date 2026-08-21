import { Mountain, Waves, Flame, CloudRain } from 'lucide-react';

export const mockDosDonts = [
  {
    id: 'dd1',
    disasterType: 'Earthquake',
    Icon: Mountain,
    dos: [
      'Drop, Cover, and Hold On under sturdy furniture',
      'Move to open areas away from buildings and trees',
      'Keep an emergency kit ready with water, food, and medicines',
      'Learn how to shut off gas, electricity, and water mains',
      'Practice earthquake drills with your family regularly',
    ],
    donts: [
      'Do not stand near windows or heavy objects',
      'Do not use elevators during an earthquake',
      'Do not light matches or candles if you smell gas',
      'Do not panic and rush toward exits',
      'Do not ignore small tremors — they may warn of larger ones',
    ],
  },
  {
    id: 'dd2',
    disasterType: 'Flood',
    Icon: Waves,
    dos: [
      'Move to higher ground immediately when warned',
      'Keep important documents in waterproof containers',
      'Switch off electricity and gas supply if safe to do so',
      'Listen to official alerts on radio or phone',
      'Stock clean drinking water in large containers',
    ],
    donts: [
      'Do not walk or drive through floodwaters',
      'Do not touch electrical equipment with wet hands',
      'Do not drink floodwater or use it for cooking',
      'Do not ignore evacuation orders from authorities',
      'Do not return home until authorities declare it safe',
    ],
  },
  {
    id: 'dd3',
    disasterType: 'Fire',
    Icon: Flame,
    dos: [
      'Learn the stop-drop-and-roll technique',
      'Install smoke detectors on every floor',
      'Keep fire extinguishers accessible and serviced',
      'Plan and practice a home fire escape route',
      'Call emergency services immediately',
    ],
    donts: [
      'Do not hide in closets or under beds during a fire',
      'Do not use elevators during fire evacuation',
      'Do not re-enter a burning building',
      'Do not overcrowd fire exits',
      'Do not leave cooking unattended',
    ],
  },
  {
    id: 'dd4',
    disasterType: 'Cyclone',
    Icon: CloudRain,
    dos: [
      'Board up windows with plywood or storm shutters',
      'Store emergency supplies for at least 3 days',
      'Move to designated cyclone shelters if advised',
      'Keep your car fueled and ready for evacuation',
      'Stay indoors and away from windows during the storm',
    ],
    donts: [
      'Do not go to the beach during a cyclone warning',
      'Do not use candles — use flashlights instead',
      'Do not stand near weak structures or trees',
      'Do not ignore official warnings',
      'Do not travel during the storm',
    ],
  },
  {
    id: 'dd5',
    disasterType: 'Tsunami',
    Icon: Waves,
    dos: [
      'Move to high ground immediately if you feel an earthquake near the coast',
      'Follow tsunami evacuation route signs',
      'Listen to official warnings on radio or phone',
      'Keep a go-bag ready near your exit door',
      'Help children, elderly, and disabled persons evacuate first',
    ],
    donts: [
      'Do not go to the shore to watch the waves',
      'Do not wait for visual confirmation of the tsunami',
      'Do not return to low-lying areas until all-clear is given',
      'Do not ignore earthquake tremors near the coast',
      'Do not try to outrun a tsunami in a car on narrow roads',
    ],
  },
];
