// client/src/pages/ProjectDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../services/api.js';
import Loader from '../components/ui/Loader.jsx';
import Button from '../components/ui/Button.jsx';
import AIChatBot from '../components/features/AIChatBot/AIChatBot.jsx';
import IoTDashboard from '../components/features/IoTDashboard/IoTDashboard.jsx';
import MLGame from '../components/features/MLGame/MLGame.jsx';
import { 
    Cpu, Zap, Code, GitBranch, ArrowLeft, ExternalLink, AlertTriangle, 
    CheckCircle, MessageSquare
} from 'lucide-react';


// Component mapping for dynamic rendering
const INTERACTIVE_COMPONENTS = {
    IoT_Dashboard: IoTDashboard,
    ML_Game: MLGame,
    AIChatBot: AIChatBot,
};


const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Fetch project by slug (this also triggers the view count tracker!)
        const response = await api.get(`/projects/${slug}`);
        setProject(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError("Project not found or server error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader size="w-10 h-10" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center p-10">
        <h1 className="text-3xl font-bold text-red-500 dark:text-red-400">{error || "Project Not Found"}</h1>
        <Link to="/projects" className="mt-6 inline-flex items-center text-pcb-green hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
        </Link>
      </div>
    );
  }
  
  // Custom markdown component rendering for the Full Description
  const markdownComponents = {
    // ... (Your custom markdown components from the Blog Post file)
    h1: ({ node, ...props }) => <h1 className="text-3xl md:text-4xl font-extrabold mt-8 mb-4 border-b pb-2 text-gray-900 dark:text-gray-100" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100" {...props} />,
    p: ({ node, ...props }) => <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
    li: ({ node, ...props }) => <li className="pl-2" {...props} />,
    a: ({ node, ...props }) => <a className="text-pcb-green hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
    code: ({ node, ...props }) => <code className="bg-gray-200 dark:bg-gray-700 text-red-500 px-1 py-0.5 rounded text-sm" {...props} />,
    pre: ({ node, ...props }) => <pre className="overflow-x-auto p-4 my-4 rounded-lg bg-gray-800 text-gray-200 text-sm" {...props} />,
  };
  
  // Determine which interactive component to render
  const InteractiveDemoComponent = project.interactiveDemo.type !== 'None' ? 
                                   INTERACTIVE_COMPONENTS[project.interactiveDemo.type] : 
                                   null;
  
  const isAIChat = project.interactiveDemo.type === 'AIChatBot';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/projects" className="inline-flex items-center  dark:text-pcb-green-light hover:underline mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Project List
      </Link>

      {/* Hero Section */}
      <div className="mb-10 pb-6 border-b dark:border-gray-700">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-gray-900 dark:text-gray-100">
          {project.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{project.shortDescription}</p>
        <span 
    className="text-sm font-semibold px-3 py-1 rounded-full 
               bg-pcb-green/20 text-pcb-green-dark 
               dark:bg-pcb-green-dark/30 dark:text-pcb-green-light" // Brighter dark mode text/bg
>
    Category: {project.category}
</span>
      </div>
      
      {/* =====================================================
        INTERACTIVE DEMO / AI CHAT SECTION
        ===================================================== */}
      <div className={`grid ${isAIChat ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3 gap-8'}`}>
        
        {/* Main Demo (or a Placeholder Image) */}
        <div className={`${isAIChat ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
            {InteractiveDemoComponent ? (
                // Render the interactive component dynamically
                isAIChat ? (
                    // AI Chat component needs project context
                    <AIChatBot projectTitle={project.title} projectDescription={project.fullDescription} />
                ) : (
                    // IoT or ML Demo Component
                    <InteractiveDemoComponent dataEndpoint={project.interactiveDemo.dataEndpoint} />
                )
            ) : (
                // Static Image Placeholder
                <img 
                    src={project.imageUrl} 
                    alt={`Screenshot of ${project.title}`} 
                    className="w-full h-auto object-cover rounded-xl shadow-xl border border-gray-200 dark:border-gray-700" 
                />
            )}
        </div>
        
        {/* Project Metadata / Links */}
        <div className={`${isAIChat ? 'lg:col-span-1' : 'lg:col-span-1'} space-y-6`}>
            {/* Quick Links */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-3">
                <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-gray-900 dark:text-gray-100 flex items-center">
                    <Code className="w-5 h-5 mr-2 text-pcb-green" /> Resources
                </h3>
                {project.repoUrl && (
                    <Button as="a" href={project.repoUrl} target="_blank" variant="secondary" className="w-full justify-center">
                        <GitBranch className="w-5 h-5 mr-2" /> View Source Code
                    </Button>
                )}
                {project.liveUrl && (
                    <Button as="a" href={project.liveUrl} target="_blank" className="w-full justify-center">
                        <ExternalLink className="w-5 h-5 mr-2" /> Live Demo
                    </Button>
                )}
                {/* AI Chat Link for non-AI Demos */}
                {!isAIChat && (
                    <Link to={`/projects/${project.slug}?chat=true`} className="block w-full">
                        <Button variant="secondary" className="w-full justify-center bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                            <MessageSquare className="w-5 h-5 mr-2" /> Talk to Project AI
                        </Button>
                    </Link>
                )}
            </div>

            {/* Tech Stack */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-gray-900 dark:text-gray-100">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, index) => (
                        <span key={index} className="px-3 py-1 text-xs font-medium rounded-full 
                                                     bg-gray-200 text-gray-700 
                                                     dark:bg-gray-700 dark:text-gray-300">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>
      
      {/* =====================================================
        FULL DESCRIPTION & ENGINEERING DECISIONS
        ===================================================== */}
      <div className="mt-12 pt-6 border-t dark:border-gray-700">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">Project Deep Dive</h2>
        
        {/* Full Markdown Description */}
        <article className="prose dark:prose-invert max-w-none mb-10">
          <ReactMarkdown components={markdownComponents}>{project.fullDescription}</ReactMarkdown>
        </article>

        {/* Engineering Decisions (ECE Proof) */}
        <h3 className="text-2xl font-bold mt-10 mb-6 text-gray-900 dark:text-gray-100 flex items-center">
            <Cpu className="w-6 h-6 mr-2 text-pcb-green" /> Key Engineering Decisions
        </h3>
        <div className="space-y-4">
            {project.engineeringDecisions && project.engineeringDecisions.length > 0 ? (
                project.engineeringDecisions.map((dec, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> 
                            {dec.tool}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 pl-7">
                            <span className="font-medium text-pcb-green-dark dark:text-pcb-green">Reason:</span> {dec.reason}
                        </p>
                    </div>
                ))
            ) : (
                <div className="text-gray-500 dark:text-gray-400 p-4 border border-dashed rounded-lg">
                    No explicit engineering decisions logged for this project yet.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;