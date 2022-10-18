import {useState, useEffect} from 'react';
import {FaSearch} from 'react-icons/fa'
import Photos from "./Photos/Photos";
import './App.css';

const clientID = `?client_id=${process.env.REACT_APP_API_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false); //loading.
  const [photos, setPhotos] = useState([]); //photos.
  const [page, setPage] = useState(1); //page.
  const [searchQuery, setSearchQuery] = useState(""); //query.
  
  const fetchImages = async() => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${searchQuery}`;
    console.log(searchQuery);

    if(searchQuery) {
      console.log("a");
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      console.log("b");
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setPhotos((oldPhoto) => {
        if(searchQuery && page === 1) {
          console.log("1");
          console.log(data.results);
          return data.results;
        } else if(searchQuery) {
          console.log("2");
          return [...oldPhoto, ...data.results];
        } else {
          console.log("3");
          return [...oldPhoto, ...data];
        }
      });
    } catch(error) {
      setLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    fetchImages();
  }, [page]);

  useEffect(() => {
    const event = window.addEventListener('scroll', () => {
      console.log(loading);
      if((!loading && window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 2)) {
        setPage((oldPage) => {
          return oldPage + 1;
        });
      }
    });

    return () => {
      window.removeEventListener('scroll', event);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages();
  }

  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input type='text' placeholder='search' className='form-input' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type='submit' className='submit-btn' onClick={handleSubmit}>
              <FaSearch />
            </button>
        </form>
      </section>
      <section className='photos'>
        <div className='photos-center'>
          {
            photos.map((image, index) => {
              return <Photos key={index} {...image} />
            })
          }
        </div>
      </section>
    </main>
  );
}
export default App;
