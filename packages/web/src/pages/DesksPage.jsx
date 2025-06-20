import React, { useEffect, useState } from 'react';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';

export default function DesksPage() {
  const [desks, setDesks] = useState([]);
  const [show, setShow] = useState(false);

  async function load() {
    const res = await fetch('/desks');
    if (res.ok) setDesks(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function addDesk() {
    await fetch('/desks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x: 10, y: 10, width: 50, height: 50 })
    });
    setShow(false);
    load();
  }

  return (
    <div>
      <Button onClick={() => setShow(true)}>Add Desk</Button>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {desks.map(d => (
          <Card key={d.id}>Desk {d.id}</Card>
        ))}
      </div>
      <Modal open={show} onClose={() => setShow(false)}>
        <h2 className="text-lg font-semibold mb-2">Add Desk</h2>
        <Button onClick={addDesk}>Create</Button>
      </Modal>
    </div>
  );
}
