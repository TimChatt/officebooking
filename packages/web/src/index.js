function App() {
  const [desks, setDesks] = React.useState([]);

  React.useEffect(() => {
    fetch('http://localhost:3000/desks')
      .then((res) => res.json())
      .then(setDesks)
      .catch(console.error);
  }, []);

  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'Office Booking'),
    React.createElement(
      'ul',
      null,
      desks.map((d) =>
        React.createElement('li', { key: d.id }, `Desk ${d.id}: (${d.x}, ${d.y})`)
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
