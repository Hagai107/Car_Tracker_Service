import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useRef } from 'react';
import jsPDF from 'jspdf';

const carsPlaceholder = [
  { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020, mileage: 30000, services: [] },
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
  const [cars, setCars] = useState(carsPlaceholder);
  const [newCar, setNewCar] = useState({ brand: '', model: '', year: '', mileage: '' });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const toggleService = (service) => {
    setCheckedServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const handleAddCar = () => {
    setCars([...cars, { ...newCar, id: cars.length + 1, services: [] }]);
    setNewCar({ brand: '', model: '', year: '', mileage: '' });
  };

  const handleSaveService = () => {
    if (selectedCar) {
      const updatedCar = { ...selectedCar, services: [...selectedCar.services, { mileage, services: checkedServices, uploadedFiles }] };
      setCars(cars.map(car => car.id === selectedCar.id ? updatedCar : car));
      setCheckedServices({});
      setUploadedFiles([]);
      setMileage('');
      setSelectedCar(null);
    }
  };

  const handleExportPDF = (car) => {
    const doc = new jsPDF();
    doc.text(`Service History for ${car.brand} ${car.model}`, 10, 10);
    car.services.forEach((service, index) => {
      doc.text(`Service #${index + 1}`, 10, 20 + (index * 10));
      doc.text(`Mileage: ${service.mileage}`, 10, 30 + (index * 10));
      doc.text(`Services: ${Object.keys(service.services).filter(key => service.services[key]).join(', ')}`, 10, 40 + (index * 10));
      doc.text(`Files: ${service.uploadedFiles.join(', ')}`, 10, 50 + (index * 10));
    });
    doc.save(`${car.brand}-${car.model}-service-history.pdf`);
  };

  return (
    <div className="min-h-screen bg-green-100 p-4">
      <Tabs defaultValue="cars" className="w-full max-w-5xl mx-auto">
        <TabsList className="flex justify-center mb-6">
          <TabsTrigger value="cars">My Cars</TabsTrigger>
          <TabsTrigger value="planner">Service Planner</TabsTrigger>
        </TabsList>

        <TabsContent value="cars">
          <Card className="mb-4">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-4">Add a Car</h2>
              <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input 
                  placeholder="Brand" 
                  value={newCar.brand} 
                  onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })} 
                />
                <Input 
                  placeholder="Model" 
                  value={newCar.model} 
                  onChange={(e) => setNewCar({ ...newCar, model: e.target.value })} 
                />
                <Input 
                  placeholder="Year" 
                  type="number" 
                  value={newCar.year} 
                  onChange={(e) => setNewCar({ ...newCar, year: e.target.value })} 
                />
                <Input 
                  placeholder="Mileage" 
                  type="number" 
                  value={newCar.mileage} 
                  onChange={(e) => setNewCar({ ...newCar, mileage: e.target.value })} 
                />
                <Button className="col-span-2 md:col-span-4" onClick={handleAddCar}>Add Car</Button>
              </form>
            </CardContent>
          </Card>

          <h2 className="text-lg font-semibold mb-2">My Cars</h2>
          {cars.map(car => (
            <Card key={car.id} className="mb-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{car.brand} {car.model}</p>
                    <p className="text-sm text-gray-600">{car.year} • {car.mileage} km</p>
                  </div>
                  <Button onClick={() => setSelectedCar(car)}>Plan Service</Button>
                  <Button onClick={() => handleExportPDF(car)}>Export Service History</Button>
                </div>
                <div className="mt-4">
                  {car.services.map((service, index) => (
                    <div key={index} className="mb-2">
                      <p className="font-semibold">Service #{index + 1}:</p>
                      <p>Mileage: {service.mileage}</p>
                      <p>Services: {Object.keys(service.services).filter(key => service.services[key]).join(', ')}</p>
                      <p>Files: {service.uploadedFiles.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="planner">
          <Card className="mb-4">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-4">Service Planner</h2>
              {selectedCar ? (
                <>
                  <div className="mb-4">
                    <p>Selected Car: <strong>{selectedCar.brand} {selectedCar.model}</strong></p>
                    <Input
                      placeholder="Enter Current Mileage"
                      value={mileage}
                      onChange={e => setMileage(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  {Object.entries(serviceGroups).map(([category, items]) => (
                    <div key={category} className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((service, index) => (
                          <Card key={index} className={`p-4 transition-colors duration-300 flex items-center justify-between ${mileage ? 'bg-white' : 'bg-gray-300'}`}>
                            <Label className="flex items-center space-x-2">
                              <Checkbox
                                checked={!!checkedServices[service]}
                                onCheckedChange={() => toggleService(service)}
                              />
                              <span>{service}</span>
                            </Label>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div>
                    <Label>Upload Receipts/Pictures</Label>
                    <Input 
                      type="file" 
                      multiple 
                      ref={fileInputRef}
                      onChange={(e) => setUploadedFiles(Array.from(e.target.files).map(file => file.name))}
                    />
                  </div>
                  <Button className="mt-4" onClick={handleSaveService}>Save Service</Button>
                </>
              ) : (
                <p>Please select a car from the "My Cars" tab.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
