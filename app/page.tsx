"use client";
import {
  useState,
  ChangeEvent,
  ChangeEventHandler,
  MouseEventHandler,
} from "react";
import FormSection from "./FormSection";

// const URL = "https://ecs111-test-6dklnz6zma-uw.a.run.app/classify";
const URL = "http://localhost:8000/classify";
console.log(URL);

interface IResponse {
  data?: string;
  error?: string;
}

interface JSONData {
  [BHK: string]: number;
}

const Home: React.FC = () => {
  const [jsonData, setJsonData] = useState<JSONData>({
    BHK: 0.0,
    Size: 0.0,
    Bathroom: 0.0,
    Floor_Ratio: 0.0,
    Area_Type_Built_Area: 0.0,
    Area_Type_Carpet_Area: 0.0,
    Area_Type_Super_Area: 0.0,
    City_Bangalore: 0.0,
    City_Chennai: 0.0,
    City_Delhi: 0.0,
    City_Hyderabad: 0.0,
    City_Kolkata: 0.0,
    City_Mumbai: 0.0,
    Furnishing_Status_Furnished: 0.0,
    Furnishing_Status_Semi_Furnished: 0.0,
    Furnishing_Status_Unfurnished: 0.0,
    Tenant_Preferred_Bachelors: 0.0,
    Tenant_Preferred_Bachelors_Family: 0.0,
    Tenant_Preferred_Family: 0.0,
    Point_of_Contact_Contact_Agent: 0.0,
    Point_of_Contact_Contact_Builder: 0.0,
    Point_of_Contact_Contact_Owner: 0.0,
  });
  const numericalFields = ["BHK", "Size", "Bathroom", "Floor_Ratio"];
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFurnishingStatus, setSelectedFurnishingStatus] = useState("");
  const [selectedTenantPreference, setSelectedTenantPreference] = useState("");
  const [selectedPointOfContact, setSelectedPointOfContact] = useState("");

  const [response, setResponse] = useState<IResponse>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    setResponse({});
    setIsLoading(true);

    // Timeout to prevent inconsistent load times (set to 0 when working in dev mode for faster load times)
    const minTimeout = new Promise((resolve: any) => setTimeout(resolve, 0));

    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData, null, 2),
    });

    try {
      // Wait for all promises to resolve
      const [_, fetchResult] = await Promise.all([minTimeout, res]);

      if (!fetchResult.ok) {
        throw new Error(`HTTP error! status: ${fetchResult.status}`);
      }

      const data = await fetchResult.json();
      setResponse({ data: JSON.stringify(data, null, 2) });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        setResponse({ error: "Error sending data" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setJsonData((prevState) => ({ ...prevState, [name]: Number(value) }));
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <h1 className="text-5xl font-semibold pt-10">
        Indian Housing Rent Classifier
      </h1>

      {/* Numerical Fields */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-10 w-[90%] p-10 bg-neutral rounded-[20px]">
        <div className="col-span-2 text-2xl">Numerical Fields</div>
        {Object.keys(jsonData)
          .filter((attr) => numericalFields.includes(attr))
          .map((attr, index) => (
            <label key={index} className="form-control ">
              <div className="label">
                <span className="label-text">{attr.replaceAll("_", " ")}</span>
              </div>
              <input
                type="text"
                name={attr}
                placeholder={"Enter a value here"}
                onChange={handleChange}
                className="input input-bordered"
              />
            </label>
          ))}
      </div>

      {/* Area Types */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-10 w-[90%] p-10 bg-neutral rounded-[20px]">
        <div className="col-span-3 text-2xl">Area Types</div>
        {Object.keys(jsonData)
          .filter((key) => key.startsWith("Area"))
          .map((value, index) => (
            <FormSection
              index={index}
              name={"area"}
              selectedValue={selectedArea}
              setSelectedValue={setSelectedArea}
              value={value}
              displayName={value.replace("Area_Type_", " ").replace("_", " ")}
            />
          ))}
      </div>

      {/* Cities */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-10 w-[90%] p-10 bg-neutral rounded-[20px]">
        <div className="col-span-3 text-2xl">City</div>
        {Object.keys(jsonData)
          .filter((key) => key.startsWith("City_"))
          .map((value, index) => (
            <FormSection
              index={index}
              name={"city"}
              selectedValue={selectedCity}
              setSelectedValue={setSelectedCity}
              value={value}
              displayName={value.replace("City_", "")}
            />
          ))}
      </div>

      {/* Furnishing Status */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-10 w-[90%] p-10 bg-neutral rounded-[20px]">
        <div className="col-span-3 text-2xl">Furnishing status</div>
        {Object.keys(jsonData)
          .filter((key) => key.startsWith("Furnishing_Status_"))
          .map((value, index) => (
            <FormSection
              index={index}
              name={"furnishing_status"}
              selectedValue={selectedFurnishingStatus}
              setSelectedValue={setSelectedFurnishingStatus}
              value={value}
              displayName={value
                .replace("Furnishing_Status_", "")
                .replace("_", "-")}
            />
          ))}
      </div>

      {/* Tenant Preference */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-10 w-[90%] p-10 bg-neutral rounded-[20px]">
        <div className="col-span-3 text-2xl">Tenant Preference</div>
        {Object.keys(jsonData)
          .filter((key) => key.startsWith("Tenant_Preferred_"))
          .map((value, index) => (
            <FormSection
              index={index}
              name={"tenant_preferred"}
              selectedValue={selectedTenantPreference}
              setSelectedValue={setSelectedTenantPreference}
              value={value}
              displayName={value
                .replace("Tenant_Preferred_", "")
                .replace("_", "/")}
            />
          ))}
      </div>

      {/* Tenant Preference */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-10 w-[90%] p-10 bg-neutral rounded-[20px]">
        <div className="col-span-3 text-2xl">Point of Contact</div>
        {Object.keys(jsonData)
          .filter((key) => key.startsWith("Point_of_Contact_Contact_"))
          .map((value, index) => (
            <FormSection
              index={index}
              name={"Point_of_Contact_Contact_"}
              selectedValue={selectedPointOfContact}
              setSelectedValue={setSelectedPointOfContact}
              value={value}
              displayName={value
                .replace("Point_of_Contact_Contact_", "")
                .replace("_", " ")}
            />
          ))}
      </div>

      <button
        className="btn btn-outline btn-primary my-5 w-80"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {/* Loading box */}
      {isLoading && <progress className="progress progress-primary w-32" />}
      {/* Output */}
      {response.data && (
        <div className="mt-4 p-2 border border-green-500 rounded-lg bg-green-50">
          <h2 className="font-bold">Response:</h2>
          <p>{response.data}</p>
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
};

export default Home;
