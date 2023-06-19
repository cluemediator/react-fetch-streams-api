import React, { useState, useEffect } from 'react';

const App = () => {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/stream');
        if (!response.ok || !response.body) {
          throw response.statusText;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            setLoading(false);
            break;
          }

          const decodedChunk = decoder.decode(value, { stream: true });
          setData(prevValue => `${prevValue}${decodedChunk}`);
        }
      } catch (error) {
        setLoading(false);
        // Handle other errors
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h3>How to read data from the Streams API in React - <a href="https://cluemediator.com" target='_blank'>Clue Mediator</a></h3>
      <div><b>Request Response: {loading && <i>Fetching data...</i>}</b>{data}</div>
    </div>
  );
};

export default App;
