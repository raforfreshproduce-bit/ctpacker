"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

interface AddSupervisorModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddSupervisor: (name: string) => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Supervisor name must be at least 2 characters." }).max(50),
});

export default function AddSupervisorModal({ isOpen, setIsOpen, onAddSupervisor }: AddSupervisorModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddSupervisor(values.name);
    toast({
      title: "Success",
      description: `Supervisor "${values.name.toUpperCase()}" has been added.`,
    });
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) form.reset(); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Supervisor</DialogTitle>
          <DialogDescription>
            Enter the name of the new supervisor. It will be saved in ALL CAPS.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. JANE DOE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
               <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Add Supervisor</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
