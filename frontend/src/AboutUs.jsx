// src/pages/About.jsx
export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>
      <p className="text-gray-600 mb-12 max-w-3xl">
        At <span className="font-semibold">Fleet Manager</span>, we are dedicated to helping companies
        streamline their operations by providing powerful tools for vehicle monitoring and reporting.
        Our mission is simple: empower businesses with the data they need to make better decisions,
        reduce downtime, and improve overall fleet efficiency.
      </p>

      {/* Team Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <img
            src="/assets/profile1.jpg"
            alt="Julian Espinoza "
            className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800">Julian Espinoza</h2>
          <p className="text-blue-600 font-medium">Front End devloper</p>
          <p className="text-gray-600 mt-2">
            Takes the lead in designin and creating the user interface and user experience.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <img
            src="/assets/profile2.jpg"
            alt="Mark Ohlwine"
            className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800">Mark Ohlwine</h2>
          <p className="text-blue-600 font-medium">Backend Web developer</p>
          <p className="text-gray-600 mt-2">
            Takes the lead in designing and implementing the server-side logic and database management.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <img
            src="/assets/profile3.jpg"
            alt="Jason Guan"
            className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800">Jason Guan</h2>
          <p className="text-blue-600 font-medium">Data Engineer </p>
          <p className="text-gray-600 mt-2">
            Takes the lead in designing and implementing data processing systems and ensuring data integrity.
          </p>
        </div>
      </div>
    </div>
  )
}
