import React, { useState, useRef, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import { Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import IncomeWidget from '../components/widgets/IncomeWidget';
import ExpenseWidget from '../components/widgets/ExpenseWidget';

const availableWidgets = {
  income: { component: IncomeWidget, w: 4, h: 6, title: 'Income', link: '/income' },
  expenses: { component: ExpenseWidget, w: 4, h: 6, title: 'Expenses', link: '/expenses' },
};

function DashboardPage() {
  const [layout, setLayout] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  const addWidget = (widgetType) => {
    const widgetConfig = availableWidgets[widgetType];
    const newWidget = {
      i: `${widgetType}-${Date.now()}`,
      x: 0,
      y: Infinity,
      w: widgetConfig.w,
      h: widgetConfig.h,
      type: widgetType,
      title: widgetConfig.title,
      link: widgetConfig.link,
    };

    setLayout([...layout, newWidget]);
    setWidgets([...widgets, newWidget]);
    setMenuOpen(false);
  };

  const removeWidget = (widgetId) => {
    setLayout(layout.filter((item) => item.i !== widgetId));
    setWidgets(widgets.filter((item) => item.i !== widgetId));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4 relative inline-block" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-blue-500 text-white px-3 py-2 rounded inline-flex items-center"
        >
          <Plus className="mr-1" size={16} /> Add Widget
        </button>

        {menuOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
            {Object.entries(availableWidgets).map(([key, widget]) => (
              <div
                key={key}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => addWidget(key)}
              >
                {widget.title}
              </div>
            ))}
          </div>
        )}
      </div>

      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        draggableHandle=".drag-handle"
        cancel=".no-drag"
        onLayoutChange={(newLayout) => setLayout(newLayout)}
      >
        {widgets.map((widget) => {
          const WidgetComponent = availableWidgets[widget.type].component;
          return (
            <div
              key={widget.i}
              className="bg-white rounded shadow relative flex flex-col overflow-hidden"
            >
              <div className="drag-handle bg-gray-200 cursor-move px-2 py-1 flex justify-between items-center">
                <span className="font-semibold text-sm">{widget.title}</span>
                <Link
                  to={widget.link}
                  className="no-drag text-sm text-gray-500 hover:text-blue-500"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ChevronRight size={16} />
                </Link>
              </div>
              <div className="p-2 overflow-auto flex-grow">
                <WidgetComponent onRemove={() => removeWidget(widget.i)} />
              </div>
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
}

export default DashboardPage;
