import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, Users, User, Sparkles } from 'lucide-react';

type StreamingService = 'netflix' | 'hbo' | 'paramount' | 'prime' | 'crunchyroll' | 'spotify';
type AccountType = 'group' | 'personal';

interface GroupForm {
  email: string;
  password: string;
  members: string[];
  service: StreamingService | '';
  day: string;
  year: string;
  type: AccountType;
}

const SERVICES_CONFIG = {
  netflix: { members: 5, color: 'bg-red-600', gradient: 'from-red-600 to-red-800' },
  hbo: { members: 5, color: 'bg-purple-600', gradient: 'from-purple-600 to-purple-800' },
  paramount: { members: 6, color: 'bg-blue-600', gradient: 'from-blue-600 to-blue-800' },
  prime: { members: 6, color: 'bg-blue-500', gradient: 'from-blue-500 to-blue-700' },
  crunchyroll: { members: 5, color: 'bg-orange-500', gradient: 'from-orange-500 to-orange-700' },
  spotify: { members: 6, color: 'bg-green-500', gradient: 'from-green-500 to-green-600' },
};

function App() {
  const [groups, setGroups] = useState<GroupForm[]>(() => {
    const savedGroups = localStorage.getItem('streamingGroups');
    return savedGroups ? JSON.parse(savedGroups) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [accountType, setAccountType] = useState<AccountType>('group');
  const [currentForm, setCurrentForm] = useState<GroupForm>({
    email: '',
    password: '',
    members: [],
    service: '',
    day: '',
    year: new Date().getFullYear().toString(),
    type: 'group',
  });

  useEffect(() => {
    localStorage.setItem('streamingGroups', JSON.stringify(groups));
  }, [groups]);

  const handleServiceSelect = (service: StreamingService) => {
    const memberCount = accountType === 'group' ? SERVICES_CONFIG[service].members : 1;
    setCurrentForm({
      ...currentForm,
      service,
      members: Array(memberCount).fill(''),
      type: accountType,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedGroups = [...groups];
      updatedGroups[editingIndex] = currentForm;
      setGroups(updatedGroups);
      setEditingIndex(null);
    } else {
      setGroups([...groups, currentForm]);
    }
    setShowForm(false);
    setCurrentForm({
      email: '',
      password: '',
      members: [],
      service: '',
      day: '',
      year: new Date().getFullYear().toString(),
      type: accountType,
    });
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...currentForm.members];
    newMembers[index] = value;
    setCurrentForm({ ...currentForm, members: newMembers });
  };

  const handleEdit = (index: number) => {
    const groupToEdit = groups[index];
    setAccountType(groupToEdit.type);
    setCurrentForm(groupToEdit);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
      const updatedGroups = groups.filter((_, i) => i !== index);
      setGroups(updatedGroups);
    }
  };

  const personalAccounts = groups.filter(group => group.type === 'personal');
  const groupAccounts = groups.filter(group => group.type === 'group');

  return (
    <div
      className="min-h-screen p-4 sm:p-8 relative"
      style={{
        backgroundImage: `url('/background.jpg')`,
        backgroundColor: '#000',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Contenido de la página */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Título "Streaming Manager" */}
        <div className="flex flex-col items-center mb-8 bg-white/10 backdrop-blur-sm rounded-3xl p-4 sm:p-6 w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-yellow-400" size={32} />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Streaming Manager</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
          >
            <PlusCircle size={20} />
            Crear Nueva Cuenta
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 mb-8 animate-fadeIn max-w-2xl mx-auto">
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => {
                  setAccountType('group');
                  setCurrentForm(prev => ({ ...prev, type: 'group' }));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  accountType === 'group'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Users size={20} />
                Cuenta Grupal
              </button>
              <button
                onClick={() => {
                  setAccountType('personal');
                  setCurrentForm(prev => ({ ...prev, type: 'personal' }));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  accountType === 'personal'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <User size={20} />
                Cuenta Personal
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servicio de Streaming
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(SERVICES_CONFIG).map(([service, config]) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceSelect(service as StreamingService)}
                      className={`${
                        currentForm.service === service
                          ? `bg-gradient-to-r ${config.gradient} text-white`
                          : 'bg-gray-100 text-gray-700'
                      } p-3 rounded-lg text-center font-medium transition-all transform hover:scale-105 capitalize`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {currentForm.service && (
                <>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo
                      </label>
                      <input
                        type="email"
                        required
                        value={currentForm.email}
                        onChange={(e) =>
                          setCurrentForm({ ...currentForm, email: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                      </label>
                      <input
                        type="text"
                        required
                        value={currentForm.password}
                        onChange={(e) =>
                          setCurrentForm({ ...currentForm, password: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Día de Pago
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="31"
                          value={currentForm.day}
                          onChange={(e) =>
                            setCurrentForm({ ...currentForm, day: e.target.value })
                          }
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Año
                        </label>
                        <input
                          type="number"
                          required
                          min="2024"
                          max="2030"
                          value={currentForm.year}
                          onChange={(e) =>
                            setCurrentForm({ ...currentForm, year: e.target.value })
                          }
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {accountType === 'group' ? 'Miembros del Grupo' : 'Nombre de Usuario'}
                    </label>
                    <div className="grid gap-3">
                      {currentForm.members.map((member, index) => (
                        <input
                          key={index}
                          type="text"
                          required
                          value={member}
                          onChange={(e) => handleMemberChange(index, e.target.value)}
                          placeholder={accountType === 'group' ? `Miembro ${index + 1}` : 'Tu nombre'}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingIndex(null);
                        setCurrentForm({
                          email: '',
                          password: '',
                          members: [],
                          service: '',
                          day: '',
                          year: new Date().getFullYear().toString(),
                          type: accountType,
                        });
                      }}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
                    >
                      {editingIndex !== null ? 'Actualizar Cuenta' : 'Guardar Cuenta'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sección "Cuentas Personales" */}
          <div className="space-y-6 bg-white/10 backdrop-blur-sm rounded-3xl p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white text-center mb-4">Cuentas Personales</h2>
            {personalAccounts.map((group, index) => (
              <div
                key={index}
                className={`bg-gradient-to-r ${
                  SERVICES_CONFIG[group.service].gradient
                } text-white rounded-lg p-4 sm:p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold capitalize">{group.service}</h3>
                    <User size={20} className="opacity-75" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <div className="opacity-90">{group.email}</div>
                      <div className="opacity-75">Pago: Día {group.day}, {group.year}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(groups.indexOf(group))}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title="Editar cuenta"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(groups.indexOf(group))}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title="Eliminar cuenta"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  {group.members.map((member, idx) => (
                    <div key={idx} className="bg-white/10 p-2 rounded backdrop-blur-sm">
                      {member}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sección "Cuentas Grupales" */}
          <div className="space-y-6 bg-white/10 backdrop-blur-sm rounded-3xl p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white text-center mb-4">Cuentas Grupales</h2>
            {groupAccounts.map((group, index) => (
              <div
                key={index}
                className={`bg-gradient-to-r ${
                  SERVICES_CONFIG[group.service].gradient
                } text-white rounded-lg p-4 sm:p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold capitalize">{group.service}</h3>
                    <Users size={20} className="opacity-75" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <div className="opacity-90">{group.email}</div>
                      <div className="opacity-75">Pago: Día {group.day}, {group.year}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(groups.indexOf(group))}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title="Editar cuenta"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(groups.indexOf(group))}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title="Eliminar cuenta"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  {group.members.map((member, idx) => (
                    <div key={idx} className="bg-white/10 p-2 rounded backdrop-blur-sm">
                      {member}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;