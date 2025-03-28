import { useState, useRef } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { Calendar as CalendarIcon, Clock, Image, ArrowLeft, Upload, Instagram, Youtube, Facebook, Linkedin, Twitter, Repeat, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, addHours, setHours, setMinutes } from 'date-fns';
import { Slider } from '@/components/ui/slider';

type FormValues = {
  title: string;
  content: string;
  platforms: string[];
  schedule: boolean;
  automate: boolean;
  scheduledDate?: Date;
  scheduledTime?: number[];
};

type MediaFile = {
  type: 'image' | 'video';
  file: File;
  preview: string;
};

const NewPost = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [scheduledTime, setScheduledTime] = useState<number[]>([9]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      content: '',
      platforms: ['instagram', 'youtube'],
      schedule: false,
      automate: true,
      scheduledDate: undefined,
      scheduledTime: [9]
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      let scheduledDateTime: Date | undefined;
      
      if (data.schedule && scheduledDate) {
        // Create a date object with the selected date and time
        scheduledDateTime = new Date(scheduledDate);
        scheduledDateTime = setHours(scheduledDateTime, scheduledTime[0]);
        scheduledDateTime = setMinutes(scheduledDateTime, 0);
        
        console.log('Scheduling post for:', scheduledDateTime);
      }
      
      console.log('Form data:', {
        ...data,
        scheduledDateTime,
        mediaFiles: mediaFiles.map(m => ({
          type: m.type,
          name: m.file.name,
          size: m.file.size
        }))
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send the data to your Supabase backend
      toast({
        title: data.schedule ? "Automation scheduled" : "Automation created",
        description: data.schedule 
          ? `Your content will be automatically posted on ${format(scheduledDateTime!, 'PPP')} at ${scheduledTime[0]}:00`
          : "Your content automation has been created and will run shortly."
      });
      
      // Navigate back to dashboard after successful submission
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating automation:', error);
      toast({
        title: "Error",
        description: "Failed to create automation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const platformIcons = {
    instagram: <Instagram className="h-5 w-5 text-pink-500" />,
    youtube: <Youtube className="h-5 w-5 text-red-500" />,
    facebook: <Facebook className="h-5 w-5 text-blue-600" />,
    twitter: <Twitter className="h-5 w-5 text-blue-400" />,
    linkedin: <Linkedin className="h-5 w-5 text-blue-700" />
  };

  const handleImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  
  const handleVideoUpload = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    const file = files[0];
    const preview = URL.createObjectURL(file);
    
    // Simulate upload delay
    setTimeout(() => {
      setMediaFiles(prev => [...prev, { type, file, preview }]);
      setIsUploading(false);
      
      toast({
        title: "Upload successful",
        description: `Your ${type} has been uploaded and will be used in your automated posts.`
      });
      
      // Reset the file input
      if (event.target) {
        event.target.value = '';
      }
    }, 1500);
  };
  
  const removeMedia = (index: number) => {
    setMediaFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview); // Clean up the URL
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <Link 
              to="/dashboard" 
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Link>
            
            <h1 className="text-3xl font-bold">Create Social Automation</h1>
            <p className="text-muted-foreground mt-1">Post your content across multiple platforms automatically</p>
          </div>
          
          <div className="glass-card p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Automation Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Name your automation" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is for your reference only
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What do you want to share across your social platforms?" 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Add Media</h3>
                  
                  {/* Hidden file inputs */}
                  <input 
                    type="file" 
                    ref={imageInputRef} 
                    accept="image/*" 
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'image')}
                  />
                  <input 
                    type="file" 
                    ref={videoInputRef} 
                    accept="video/*" 
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'video')}
                  />
                  
                  {/* Display uploaded media previews */}
                  {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      {mediaFiles.map((media, index) => (
                        <div key={index} className="relative group rounded-md overflow-hidden border border-border">
                          {media.type === 'image' ? (
                            <img 
                              src={media.preview} 
                              alt={`Upload ${index + 1}`} 
                              className="w-full h-24 object-cover"
                            />
                          ) : (
                            <div className="w-full h-24 flex items-center justify-center bg-muted">
                              <video 
                                src={media.preview} 
                                className="w-full h-full object-cover"
                              />
                              <Upload className="absolute h-8 w-8 text-white" />
                            </div>
                          )}
                          <button 
                            type="button"
                            onClick={() => removeMedia(index)}
                            className="absolute top-1 right-1 bg-background/90 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="h-auto py-4 flex-col items-center justify-center gap-2 border-dashed"
                      onClick={handleImageUpload}
                      disabled={isUploading}
                    >
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Image className="h-5 w-5" />
                      </div>
                      <span className="text-sm">
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                      </span>
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="h-auto py-4 flex-col items-center justify-center gap-2 border-dashed"
                      onClick={handleVideoUpload}
                      disabled={isUploading}
                    >
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Upload className="h-5 w-5" />
                      </div>
                      <span className="text-sm">
                        {isUploading ? 'Uploading...' : 'Upload Video'}
                      </span>
                    </Button>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="automate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-border rounded-lg bg-primary/5">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-medium flex items-center">
                          <Repeat className="h-4 w-4 mr-2" />
                          Enable cross-platform posting
                        </FormLabel>
                        <FormDescription>
                          Automatically adapt your content to each platform's requirements
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div>
                  <h3 className="font-medium mb-3">Select Target Platforms</h3>
                  <div className="flex flex-wrap gap-3">
                    {['instagram', 'youtube', 'facebook', 'twitter', 'linkedin'].map((platform) => (
                      <FormField
                        key={platform}
                        control={form.control}
                        name="platforms"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(platform)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, platform]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter((value) => value !== platform)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="flex items-center cursor-pointer space-x-2">
                              {platformIcons[platform as keyof typeof platformIcons]}
                              <span className="capitalize">{platform}</span>
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-border rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-medium flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Schedule automated posting
                        </FormLabel>
                        <FormDescription>
                          Your post will be automatically shared at the scheduled time
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {form.watch('schedule') && (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <FormLabel>Schedule Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduledDate ? (
                              format(scheduledDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={scheduledDate}
                            onSelect={setScheduledDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <FormLabel>Schedule Time</FormLabel>
                        <span className="text-sm text-muted-foreground">
                          {scheduledTime[0]}:00
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Slider
                          value={scheduledTime}
                          onValueChange={setScheduledTime}
                          max={23}
                          min={0}
                          step={1}
                          className="flex-1"
                        />
                      </div>
                      <FormDescription>
                        Posts are scheduled on the hour
                      </FormDescription>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      form.watch('schedule') ? 'Schedule Automation' : 'Start Automation'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewPost;
