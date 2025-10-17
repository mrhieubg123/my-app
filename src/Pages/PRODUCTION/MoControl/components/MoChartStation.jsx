import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ArcDiagram from 'highcharts/modules/arc-diagram';

// Kích hoạt module arc-diagram
ArcDiagram(Highcharts);

const TrainArcDiagram = () => {
  const options = {
    chart: {
      type: 'arcdiagram'
    },
    title: {
      text: 'Main train connections in Europe'
    },
    
    series: [
      {
        keys: ['from', 'to', 'weight'],
        type: 'arcdiagram',
        name: 'Train connections',
        
        data: [
          ['Hamburg', 'Stuttgart', 1],
          ['Hamburg', 'Frankfurt', 1],
          ['Hamburg', 'München', 1],
          ['Hannover', 'Wien', 1],
          ['Hannover', 'München', 1],
          ['Berlin', 'Wien', 1],
          ['Berlin', 'Berlin', 1],
          ['Berlin', 'Berlin', 1],
          ['Berlin', 'Berlin', 1],
          ['Berlin', 'Berlin', 1],
          ['Berlin', 'Berlin', 1],
          ['München', 'Düsseldorf', 1],
          ['München', 'Wien', 1],
          ['München', 'Frankfurt', 1],
          ['München', 'Köln', 1],
          ['München', 'Amsterdam', 1],
          ['Stuttgart', 'Wien', 1],
          ['Frankfurt', 'Wien', 1],
          ['Frankfurt', 'Amsterdam', 1],
          ['Frankfurt', 'Paris', 1],
          ['Frankfurt', 'Budapest', 1],
          ['Düsseldorf', 'Wien', 1],
          ['Düsseldorf', 'Hamburg', 1],
          ['Amsterdam', 'Paris', 1],
          ['Paris', 'Brest', 1],
          ['Paris', 'Nantes', 1],
          ['Paris', 'Bayonne', 1],
          ['Paris', 'Bordeaux', 1],
          ['Paris', 'Toulouse', 1],
          ['Paris', 'Montpellier', 1],
          ['Paris', 'Marseille', 1],
          ['Paris', 'Nice', 1],
          ['Paris', 'Milano', 1],
          ['Nantes', 'Nice', 1],
          ['Bordeaux', 'Lyon', 1],
          ['Nantes', 'Lyon', 1],
          ['Milano', 'München', 1],
          ['Milano', 'Roma', 1],
          ['Milano', 'Bari', 1],
          ['Milano', 'Napoli', 1],
          ['Milano', 'Brindisi', 1],
          ['Milano', 'Lamezia Terme', 1],
          ['Torino', 'Roma', 1],
          ['Venezia', 'Napoli', 1],
          ['Roma', 'Bari', 1],
          ['Roma', 'Catania', 1],
          ['Roma', 'Brindisi', 1],
          ['Catania', 'Milano', 1]
        ]
      }
    ]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default TrainArcDiagram;
