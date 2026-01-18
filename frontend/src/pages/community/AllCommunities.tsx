import { useEffect, useState } from "react";
import NotCommunites from "../../components/community/NotCommunites";
import { getCommunities } from "../../services/communityService";
import CommunityCard from "../../components/community/CommunityCard";

const AllCommunities = () => {
  const [communities, setCommuities] = useState<CommunityCard[]>([]);
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await getCommunities();
        setCommuities(res.communities);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCommunities();
  }, []);

  if (communities.length === 0) {
    return <NotCommunites />;
  }
  return (
    <div className="md:w-[80%] w-full min-h-screen  mx-auto pt-28">
      <div className=" text-4xl  font-extrabold mx-auto w-fit">
        <span
          className="p-1 px-3 md:px-4 bg-linear-to-r from-cyan-500
         to-blue-500 text-white rounded-lg mx-2 "
        >
          J
        </span>
        oin Your Favorite{" "}
        <span className="p-1 px-2.5 md:px-3 bg-linear-to-r mx-2 from-violet-500 to-fuchsia-500 text-white rounded-lg ">
          C
        </span>
        ommunities.
      </div>

      <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-4">
        {communities.map((c, i) => (
          <CommunityCard community={c} key={i} />
        ))}
      </div>
    </div>
  );
};

export default AllCommunities;
