"use client"
import { useState, ChangeEvent } from 'react';

const URL = "https://ecs111-test-6dklnz6zma-uw.a.run.app/classify"
const localURL = "localhost:8000"
console.log(URL)

interface IResponse {
  data?: string;
  error?: string;
}

const Home: React.FC = () => {
  const [jsonData, setJsonData] = useState(JSON.stringify({
    "BHK": 2.0,
    "Size": 1000.0,
    "Bathroom": 2.0,
    "Floor_Ratio": 0.0,
    "Area_Type_Built_Area": 0.0,
    "Area_Type_Carpet_Area": 0.0,
    "Area_Type_Super_Area": 1.0,
    "City_Bangalore": 1.0,
    "City_Chennai": 0.0,
    "City_Delhi": 0.0,
    "City_Hyderabad": 0.0,
    "City_Kolkata": 0.0,
    "City_Mumbai": 0.0,
    "Furnishing_Status_Furnished": 0.0,
    "Furnishing_Status_Semi_Furnished": 1.0,
    "Furnishing_Status_Unfurnished": 0.0,
    "Tenant_Preferred_Bachelors": 0.0,
    "Tenant_Preferred_Bachelors_Family": 1.0,
    "Tenant_Preferred_Family": 0.0,
    "Point_of_Contact_Contact_Agent": 0.0,
    "Point_of_Contact_Contact_Builder": 0.0,
    "Point_of_Contact_Contact_Owner": 1.0
  }, null, 2));
  const [response, setResponse] = useState<IResponse>({});

  const handleSubmit = async (): Promise<void> => {
    setResponse({});
    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse({ data: JSON.stringify(data, null, 2) });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
        setResponse({ error: 'Error sending data' });
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setJsonData(event.target.value);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Send Data for Classification</h1>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-lg"
        rows={15}
        value={jsonData}
        onChange={handleChange}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {response.data && (
        <div className="mt-4 p-2 border border-green-500 rounded-lg bg-green-50">
          <h2 className="font-bold">Response:</h2>
          <pre>{response.data}</pre>
        </div>
      )}
      {response.error && (
        <div className="mt-4 p-2 border border-red-500 rounded-lg bg-red-50">
          <h2 className="font-bold">Error:</h2>
          <p>{response.error}</p>
        </div>
      )}
    </div>
  );
}

export default Home;