"use client";

export default function BannerPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white border-2 border-gray-300 shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Top Blue Stripe with Company Name */}
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide text-center">
            SummitHill IT Consultants Private Limited
          </h1>
        </div>

        {/* White Content Section */}
        <div className="px-6 py-5 space-y-3 bg-white">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
            <div className="text-base md:text-lg">
              <strong className="text-gray-900">CIN :</strong>
              <span className="ml-2 text-gray-800 font-mono">U62099MH2025PTC452594</span>
            </div>
            <div className="text-base md:text-lg">
              <strong className="text-gray-900">PAN :</strong>
              <span className="ml-2 text-gray-800 font-mono">ABQCS7674G</span>
            </div>
          </div>

          <div className="text-base md:text-lg pt-2">
            <div className="flex">
              <strong className="text-gray-900 whitespace-nowrap">Regd. Off. :</strong>
              <div className="ml-2 flex-1">
                <div className="text-gray-800">59, Nr Ram Mandir, 2nd Lane, Bhd Sai Mandir, Wardha Road,</div>
                <div className="text-gray-800">Vivekanand Nagar, Nagpur - 440015, Maharashtra.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Blue Stripe with Contact Information */}
        <div className="bg-blue-600 px-6 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 text-white">
            <div className="text-base md:text-lg">
              <strong>Email :</strong>
              <a 
                href="mailto:Dr.Rajeshchaware@summithillit.com" 
                className="ml-2 text-white hover:text-blue-200 underline"
              >
                dr.rajeshchaware@summithillit.com
              </a>
            </div>
            <div className="text-base md:text-lg">
              <strong>Mob. :</strong>
              <a 
                href="tel:9767921936" 
                className="ml-2 text-white hover:text-blue-200 underline"
              >
                +91-9767921936
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

