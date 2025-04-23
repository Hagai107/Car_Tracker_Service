
import { useState } from 'react';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Input } from './components/ui/Input';
import { Checkbox } from './components/ui/Checkbox';

const carsPlaceholder = [
  { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020, mileage: 30000 },
];

const serviceGroups = {
  'Fluids': [
    "Oil and oil filter change",
    "Brake fluid replacement (every 2 years)",
    "Transmission fluid check/change",
    "Coolant flush and refill",
    "Differential and transfer case fluid (for 4WD/AWD)"
  ],
  'Filters': [
    "Air filter replacement",
    "Cabin (pollen) filter replacement",
    "Fuel filter replacement (for diesel engines)"
  ],
  'Engine': [
    "Spark plug replacement (for petrol engines)",
    "Timing belt/chain inspection or replacement (if due)",
    "Timing belt replacement (usually every 90,000–120,000 km or 5–7 years)",
    "Detailed engine diagnostic check",
    "Carbon cleaning for intake valves (direct injection engines)"
  ],
  'General Inspection': [
    "Inspection of fluid levels (brake, coolant, washer, etc.)",
    "Tire pressure check and adjustment",
    "Visual inspection of brakes, belts, and hoses",
    "Battery check",
    "Lights and wipers inspection",
    "Service light reset",
    "Fuel system inspection",
    "Suspension and steering check",
    "Wheel alignment and balancing",
    "Gearbox/Transmission service (especially for automatics or CVTs)",
    "AC system service"
  ]
};

export default function App() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [mileage, setMileage] = useState('');
  const [checkedServices, setCheckedServices] = useState({});

  const toggleService = (service) => {
    setCheckedServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  return (
    <div className="min-h-screen bg-green-100 p-4">
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-4">My Cars</h2>
        {carsPlaceholder.map(car => (
          <Card key={car.id} className="mb-4">
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{car.brand} {car.model}</p>
                <p className="text-sm text-gray-600">{car.year} • {car.mileage} km</p>
              </div>
              <Button onClick={() => setSelectedCar(car)}>Plan Service</Button>
            </div>
          </Card>
        ))}

        <h2 className="text-xl font-bold mt-6 mb-4">Service Planner</h2>
        {selectedCar ? (
          <div>
            <p>Selected Car: <strong>{selectedCar.brand} {selectedCar.model}</strong></p>
            <Input
              placeholder="Enter Current Mileage"
              value={mileage}
              onChange={e => setMileage(e.target.value)}
              className="mt-2 mb-4"
            />
            {Object.entries(serviceGroups).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                {items.map((service, index) => (
                  <Card key={index} className="p-4 mb-2">
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={!!checkedServices[service]}
                        onCheckedChange={() => toggleService(service)}
                      />
                      <span>{service}</span>
                    </label>
                  </Card>
                ))}
              </div>
            ))}
            <Button>Export to PDF</Button>
          </div>
        ) : (
          <p>Please select a car to plan services.</p>
        )}
      </div>
    </div>
  );
}
