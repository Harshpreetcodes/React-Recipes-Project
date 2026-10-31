import axios from "axios";
import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import useLoading from "../hooks/useLoading";


function Home() {
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);

  // const [loading, setLoading] = useState(true);
   const {loading, startLoading, stopLoading} = useLoading(); // by using custom made hook

  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchRecipes(skipCount, query) {
    // setLoading(true);
    startLoading();
    try {
      let url = `https://dummyjson.com/recipes?limit=9&skip=${skipCount}`; // it is url for all recipes

      if(query){ //if we searched then this url will be used
        url = `https://dummyjson.com/recipes/search?limit=6&skip=${skipCount}&q=${query}`; //it is url when we do searching
      }

      const { data } = await axios.get(url);
      setRecipes((prev) => skipCount === 0 ? data.recipes : [...prev, ...data.recipes]); // [...prev, ...data.recipes] it is a way to add data to existing data or to merge two arrays data
      setTotal(data.total);
    } catch (error) {
      setErrorMsg("Please try again later.");
    }

    // setLoading(false);
    stopLoading();
  }

  useEffect(() => {
    fetchRecipes(0); //first passing of skipcount
  }, []);

  function handleSearch(e){
      e.preventDefault();

      const form = new FormData(e.target);
      let query = form.get("query").trim(); 
      setSearchQuery(query);
      // if(query){
          fetchRecipes(0, query);
      // }
  }

  if (loading) {
    return <p className="text-center py-6 text-muted">Loading....</p>;
  }

  if (errorMsg) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-accent text-center">{errorMsg || "Recipe not found."}</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
        <input
          type="text"
          name="query" // the names we are searching in search bar 
          placeholder="Search recipes..."
          className="flex-1 border border-border rounded px-3 py-2 bg-card text-text outline-none focus:border-accent"
        />
        <button 
          type="submit"
          className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium"
        >
          Search
        </button>
      </form>

      {recipes.length === 0 && <p className="text-center py-6 text-muted">{`No recipes found for '${searchQuery}'`}</p>}


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {recipes.length < total && <div className="text-center mt-8"> {/*when recipes.length > total reaches then load more button will vanish*/}
        <button
          type="button"
          onClick={() => fetchRecipes(recipes.length, searchQuery)} //passing skipcount
          className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium"
        >
          Load More
        </button>
      </div>}
    </main>
  );
}

export default Home;
