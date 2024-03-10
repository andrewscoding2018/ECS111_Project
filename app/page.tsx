"use client";
import {
  useState,
  useEffect,
  ChangeEvent,
  ChangeEventHandler,
  MouseEventHandler,
  SetStateAction,
} from "react";
import MultiSelect from "./MultiSelect";
import NumInput from "./NumInput";
import Charts from "./Charts";

const environment = process.env.NEXT_PUBLIC_NODE_ENV

const serverURL = (environment == "development") ? process.env.NEXT_PUBLIC_LOCAL : process.env.NEXT_PUBLIC_GCP

interface IResponse {
  data?: number;
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

  const [activeTab, setActiveTab] = useState('tab1');
  const handleTabClick = (tabId: SetStateAction<string>) => {
    setActiveTab(tabId);
  };

  const [response, setResponse] = useState<IResponse>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    setResponse({});
    setIsLoading(true);

    if (selectedFurnishingStatus == "" || selectedTenantPreference == "" || selectedPointOfContact == "") {
      setResponse({
        error: "You must select an option from each field."
      })
      setIsLoading(false)
      return
    }

    for (var key of numericalFields) {
      console.log(key)
      if (jsonData[key] <= 0) {
        setResponse({
          error: "You must provide a positive value for each numerical field."
        })
        setIsLoading(false)
        return
      }
    }

    // Timeout to prevent inconsistent load times (set to 0 when working in dev mode for faster load times)
    const minTimeout = new Promise((resolve: any) => setTimeout(resolve, 0));

    if (typeof serverURL === 'undefined') {
      throw new Error('Server URL is not defined');
    }

    const payload = {
      ...jsonData, // existing numerical fields and others
      // Add or update these fields in the payload
      [selectedArea]: 1,
      [selectedCity]: 1,
      [selectedFurnishingStatus]: 1,
      [selectedTenantPreference]: 1,
      [selectedPointOfContact]: 1,
    };

    // console.log(payload)

    const res = await fetch(serverURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload, null, 2),
    });

    try {
      // Wait for all promises to resolve
      const [_, fetchResult] = await Promise.all([minTimeout, res]);

      if (!fetchResult.ok) {
        throw new Error(`HTTP error! status: ${fetchResult.status}`);
      }

      const data = await fetchResult.json();
      setResponse({ data: data["prediction"] });
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

  // useEffect(() => {
  //   console.log(jsonData);
  // }, [jsonData]);

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <h1 className="md:text-3xl text-xl flex-wrap  m-3 font-semibold pt-5">
        India Major City Housing Rent Prediction
      </h1>

      <div role="tablist" className="tabs tabs-bordered">
        <a role="tab" className={`tab ${activeTab === 'tab1' ? 'tab-active' : ''}`} onClick={() => handleTabClick('tab1')}>Prediction</a>
        <a role="tab" className={`tab ${activeTab === 'tab2' ? 'tab-active' : ''}`} onClick={() => handleTabClick('tab2')}>Charts</a>
      </div>

      {activeTab == "tab1" && (
        <div className="flex flex-col justify-center items-center gap-5 w-full">
          {/* Numerical Fields */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-10 w-[90%] p-5 bg-slate-100 rounded-md">
            <div className="md:col-span-2 text-slate-700 text-xl font-bold">Numerical Fields</div>
            <NumInput
              name={numericalFields[0]}
              placeholder={"Try a value like 3"}
              handleChange={handleChange}
              displayName="Bedrooms"
            />
            <NumInput
              name={numericalFields[1]}
              placeholder={"Try a value like 2000"}
              handleChange={handleChange}
              displayName="Size"
            />
            <NumInput
              name={numericalFields[2]}
              placeholder={"Try a value like 1"}
              handleChange={handleChange}
              displayName="Bathrooms"
            />
            <NumInput
              name={numericalFields[3]}
              placeholder={"Try a value like 0.5"}
              handleChange={handleChange}
              displayName="Floor Ratio"
            />
          </div>

          {/* Area Types */}
          <div className="grid md:grid-cols-3 grid-cols-1 gap-2 w-[90%] p-5 bg-slate-100 rounded-md">
            <div className="md:col-span-3 col-span-1 text-xl text-slate-700 p-0 font-bold">Area Types</div>
            {Object.keys(jsonData)
              .filter((key) => key.startsWith("Area"))
              .map((value, index) => (
                <MultiSelect
                  index={index}
                  key={index}
                  name={"area"}
                  selectedValue={selectedArea}
                  setSelectedValue={setSelectedArea}
                  value={value}
                  displayName={value.replace("Area_Type_", " ").replace("_", " ")}
                />
              ))}
          </div>

          {/* Cities */}
          <div className="grid md:grid-cols-3 grid-cols-1 gap-2 w-[90%] p-5 bg-slate-100 rounded-md">
            <div className="md:col-span-3 col-span-1 text-xl text-slate-700 font-bold">City</div>
            {Object.keys(jsonData)
              .filter((key) => key.startsWith("City_"))
              .map((value, index) => (
                <MultiSelect
                  index={index}
                  key={index}
                  name={"city"}
                  selectedValue={selectedCity}
                  setSelectedValue={setSelectedCity}
                  value={value}
                  displayName={value.replace("City_", "")}
                />
              ))}
          </div>


          {/* Furnishing Status */}
          <div className="grid md:grid-cols-3 grid-cols-1 gap-2 w-[90%] p-5 bg-slate-100 rounded-md">
            <div className="md:col-span-3 col-span-1 text-xl text-slate-700 font-bold">Furnishing status</div>
            {Object.keys(jsonData)
              .filter((key) => key.startsWith("Furnishing_Status_"))
              .map((value, index) => (
                <MultiSelect
                  index={index}
                  key={index}
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
          <div className="grid md:grid-cols-3 grid-cols-1 gap-2 w-[90%] p-5 bg-slate-100 rounded-md">
            <div className="md:col-span-3 col-span-1 text-xl text-slate-700 font-bold">Tenant Preference</div>
            {Object.keys(jsonData)
              .filter((key) => key.startsWith("Tenant_Preferred_"))
              .map((value, index) => (
                <MultiSelect
                  index={index}
                  key={index}
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
          <div className="grid md:grid-cols-3 grid-cols-1 gap-2 w-[90%] p-5 bg-slate-100 rounded-md">
            <div className="md:col-span-3 col-span-1 text-xl text-slate-700 font-bold">Point of Contact</div>
            {Object.keys(jsonData)
              .filter((key) => key.startsWith("Point_of_Contact_Contact_"))
              .map((value, index) => (
                <MultiSelect
                  index={index}
                  key={index}
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

          <div className="mb-40">
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
                <h2 className="font-bold">Your monthly rent (in rupees) costs:</h2>
                <br></br>
                <p>{Math.trunc(response.data)}₹</p>
              </div>
            )}
            {response.error && (
              <div className="mt-4 p-2 border border-red-500 rounded-lg bg-red-50">
                <h2 className="font-bold">Error:</h2>
                <p>{response.error}</p>
              </div>
            )}
          </div>
        </div>

      )}
      {activeTab == "tab2" && (
        <Charts />
      )}
    </div>

  );
};

export default Home;
