import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkipLinks } from '@/components/accessibility/SkipLinks';
import { AccessibleModal } from '@/components/accessibility/AccessibleModal';
import { LiveRegion } from '@/components/accessibility/LiveRegion';
import { useDynamicFocus } from '@/hooks/useDynamicFocus';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: 'Learn about accessibility', completed: false },
    { id: 2, text: 'Implement focus management', completed: true },
    { id: 3, text: 'Test with keyboard navigation', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const { storeFocus, announceUpdate } = useDynamicFocus([todos, activeTab], {
    focusOnUpdate: false,
    announceChanges: true,
  });

  const addTodo = () => {
    if (newTodo.trim()) {
      storeFocus();
      const newItem = {
        id: Date.now(),
        text: newTodo,
        completed: false,
      };
      setTodos([...todos, newItem]);
      setNewTodo('');
      announceUpdate(`Todo "${newTodo}" added successfully`);
      setAnnouncement(`Todo "${newTodo}" added successfully`);
    }
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    
    const todo = todos.find(t => t.id === id);
    const status = !todo?.completed ? 'completed' : 'marked as incomplete';
    announceUpdate(`Todo "${todo?.text}" ${status}`);
    setAnnouncement(`Todo "${todo?.text}" ${status}`);
  };

  const deleteTodo = (id: number) => {
    const todoToDelete = todos.find(t => t.id === id);
    setTodos(todos.filter(todo => todo.id !== id));
    announceUpdate(`Todo "${todoToDelete?.text}" deleted`);
    setAnnouncement(`Todo "${todoToDelete?.text}" deleted`);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SkipLinks />
      <LiveRegion message={announcement} />
      
      <header id="header" className="bg-primary text-primary-foreground py-4 px-6">
        <h1 className="text-2xl font-bold">Accessible Focus Management Demo</h1>
        <p className="text-sm opacity-90 mt-1">
          WCAG 2.1 compliant focus management implementation
        </p>
      </header>

      <nav id="navigation" className="bg-secondary px-6 py-3" role="navigation" aria-label="Main navigation">
        <div className="flex gap-4">
          <Button variant="ghost" className="text-secondary-foreground">
            Home
          </Button>
          <Button variant="ghost" className="text-secondary-foreground">
            About
          </Button>
          <Button variant="ghost" className="text-secondary-foreground">
            Contact
          </Button>
        </div>
      </nav>

      <main id="main-content" className="container mx-auto px-6 py-8" role="main">
        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4">Focus Management Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Modal Dialog</CardTitle>
                  <CardDescription>
                    Test modal with proper focus trap and return
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={openModal}>
                    Open Accessible Modal
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skip Links</CardTitle>
                  <CardDescription>
                    Press Tab to see skip navigation links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tab through the page to see skip links that help keyboard users navigate quickly.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="demo">Demo App</TabsTrigger>
              <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Focus Management Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">✅ Implemented Features:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Automatic focus return after modal dialogs close</li>
                      <li>Focus trapping within modal dialogs</li>
                      <li>Skip links for keyboard navigation</li>
                      <li>Dynamic content update announcements</li>
                      <li>Proper focus indicators for all interactive elements</li>
                      <li>WCAG 2.1 Success Criterion 2.4.3 compliance</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Todo Demo</CardTitle>
                  <CardDescription>
                    Test dynamic focus management with this todo application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Add a new todo..."
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                      className="flex-1"
                      aria-label="New todo item"
                    />
                    <Button onClick={addTodo} disabled={!newTodo.trim()}>
                      Add Todo
                    </Button>
                  </div>

                  <div className="space-y-2" role="list" aria-label="Todo items">
                    {todos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                        role="listitem"
                      >
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                            todo.completed
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-input'
                          }`}
                          aria-label={`${todo.completed ? 'Unmark' : 'Mark'} "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                        >
                          {todo.completed && '✓'}
                        </button>
                        
                        <span
                          className={`flex-1 ${
                            todo.completed ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {todo.text}
                        </span>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteTodo(todo.id)}
                          aria-label={`Delete todo "${todo.text}"`}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>

                  {todos.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No todos yet. Add one above to get started!
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guidelines" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>WCAG 2.1 Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Success Criterion 2.4.3 (Focus Order):</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability.
                    </p>
                    
                    <h4 className="font-semibold mb-2">Implementation:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Focus returns to the triggering element after modal dialogs close</li>
                      <li>Focus is trapped within modal dialogs using keyboard event handling</li>
                      <li>Skip links provide quick navigation for keyboard users</li>
                      <li>Dynamic content changes are announced to screen readers</li>
                      <li>Focus order follows logical reading sequence</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer id="footer" className="bg-muted mt-16 py-8 px-6" role="contentinfo">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            Accessible Focus Management Demo - WCAG 2.1 Compliant
          </p>
        </div>
      </footer>

      <AccessibleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Accessible Modal Example"
        description="This modal demonstrates proper focus management with automatic focus return."
        initialFocus="button[id='modal-primary-action']"
      >
        <div className="space-y-4">
          <p>
            This is an accessible modal dialog that demonstrates proper focus management:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Focus was stored before opening</li>
            <li>Initial focus is set to the first interactive element</li>
            <li>Focus is trapped within the modal</li>
            <li>Escape key closes the modal</li>
            <li>Focus returns to the triggering button when closed</li>
          </ul>
          
          <div className="flex gap-2 pt-4">
            <Button id="modal-primary-action" onClick={closeModal}>
              Primary Action
            </Button>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </div>
      </AccessibleModal>
    </div>
  );
};

export default Index;