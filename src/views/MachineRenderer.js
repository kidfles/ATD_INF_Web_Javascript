import { AppStore } from '../utils/AppStore.js';

export class MachineRenderer {
    static create(machine) {
        const el = document.createElement('div');
        el.className = 'machine';
        el.dataset.id = machine.id; // Belangrijk voor events

        // Header met info
        const title = document.createElement('div');
        title.innerHTML = `<strong>Machine ${machine.id.substr(0, 4)}</strong><br>Snelheid: ${machine.configuredSpeed}`;
        el.appendChild(title);

        // [NEW] Delete Button
        const delBtn = document.createElement('button');
        delBtn.innerHTML = '×';
        delBtn.className = 'btn-delete';
        delBtn.title = 'Verwijder Machine';
        delBtn.style.top = '10px';
        delBtn.style.right = '10px';
        delBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Verwijder Machine ${machine.id}?`)) {
                AppStore.removeMachine(machine.id);
                el.remove();
            }
        };
        el.appendChild(delBtn);

        // Status schermpje
        const status = document.createElement('div');
        status.className = 'machine-status';
        status.innerText = 'STATUS: IDLE';
        status.id = `status-${machine.id}`;
        el.appendChild(status);

        // Het slot (Dropzone)
        const slot = document.createElement('div');
        slot.className = 'machine-slot';
        slot.dataset.type = 'machine-slot'; // Voor drag controller
        slot.dataset.machineId = machine.id;
        el.appendChild(slot);

        // Start Knop
        const btn = document.createElement('button');
        btn.className = 'btn-mix';
        btn.innerText = 'START MIX';
        btn.id = `btn-${machine.id}`;
        // We koppelen de click handler later in de controller
        el.appendChild(btn);

        return el;
    }

    static updateStatus(machineId, text, isRunning) {
        const statusEl = document.getElementById(`status-${machineId}`);
        const machineEl = document.querySelector(`.machine[data-id="${machineId}"]`);

        if (statusEl) statusEl.innerText = `STATUS: ${text}`;

        if (machineEl) {
            if (isRunning) machineEl.classList.add('machine-running');
            else machineEl.classList.remove('machine-running');
        }
    }
}
