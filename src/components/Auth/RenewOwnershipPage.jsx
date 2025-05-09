import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function RenewMembershipPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear accessToken, ownerData, etc.
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Access Restricted</h2>
      <p className="mb-6 text-gray-700">Your trial or membership has ended.</p>
      <p>Please contact Krishna Shinde 9604016475</p>
      <div className="space-x-4">
        {/* <Button onClick={() => navigate('/pricing')} className="bg-green-600 text-white">Renew Membership</Button> */}
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
}
