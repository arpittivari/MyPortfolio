// client/src/pages/ProjectDetail.jsx - FINAL VERSION WITH ALL FIXES

import React, { useEffect, useState, useRef } from 'react'; // Added useRef
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

// Custom markdown component rendering (ensure these match your blog post styles)
const markdownComponents = {
    h1: ({ node, ...props }) => <h1 className="text-3xl md:text-4xl font-extrabold mt-8 mb-4 border-b pb-2 text-gray-900 dark:text-gray-100" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100" {...props} />,
    p: ({ node, ...props }) => <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
    li: ({ node, ...props }) => <li className="pl-2" {...props} />,
    a: ({ node, ...props }) => <a className="text-pcb-green hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
    code: ({ node, ...props }) => <code className="bg-gray-200 dark:bg-gray-700 text-red-500 px-1 py-0.5 rounded text-sm font-mono" {...props} />, // Added font-mono
    pre: ({ node, ...props }) => <pre className="overflow-x-auto p-4 my-4 rounded-lg bg-gray-800 text-gray-200 text-sm font-mono" {...props} />, // Added font-mono
};

const ProjectDetail = () => {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const interactiveDemoRef = useRef(null); // Ref for scrolling

    // Handler function to scroll to the demo
    const handleScrollToDemo = (e) => {
        e.preventDefault();
        interactiveDemoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true); // Ensure loading starts true
            setError(null);
            try {
                const response = await api.get(`/projects/${slug}`);
                setProject(response.data);
            } catch (err) {
                console.error("Failed to fetch project:", err);
                setError("Project not found or server error occurred.");
                setProject(null); // Explicitly set project to null on error
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [slug]);

    // --- Loading State ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader size="w-10 h-10" />
            </div>
        );
    }

    // --- Error State ---
    if (error || !project) {
        return (
            <div className="max-w-4xl mx-auto py-12 text-center p-10">
                <h1 className="text-3xl font-bold text-red-500 dark:text-red-400">{error || "Project Data Not Found"}</h1>
                <Link to="/projects" className="mt-6 inline-flex items-center text-pcb-green hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
                </Link>
            </div>
        );
    }

    // --- Determine Interactive Component ---
    // Safe check using optional chaining (?.)
    const interactiveDemoType = project.interactiveDemo?.type;
    const InteractiveDemoComponent = interactiveDemoType &&
                                     interactiveDemoType !== 'None' &&
                                     INTERACTIVE_COMPONENTS[interactiveDemoType] ?
                                     INTERACTIVE_COMPONENTS[interactiveDemoType] : null;
    
    const isAIChat = interactiveDemoType === 'AIChatBot';
    const hasInteractiveDemo = !!InteractiveDemoComponent;

    // --- Render Component ---
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Link - Corrected */}
            <Link
                to="/projects"
                className="inline-flex items-center text-pcb-green dark:text-pcb-green-light hover:underline mb-6 font-medium"
            >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Project List
            </Link>

            {/* Hero Section - Corrected */}
            <div className="mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-gray-900 dark:text-gray-100">
                    {project.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{project.shortDescription}</p>
                <span
                    className="text-sm font-semibold px-3 py-1 rounded-full
                               bg-pcb-green/20 text-pcb-green-dark
                               dark:bg-pcb-green-dark/30 dark:text-pcb-green-light"
                >
                    Category: {project.category}
                </span>
            </div>

            {/* =====================================================
              INTERACTIVE DEMO / AI CHAT / IMAGE SECTION + METADATA
              ===================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- Left Column: Demo/Image (Takes 2 cols if not AI Chat) --- */}
                {/* Add the ref here */}
                <div ref={interactiveDemoRef} className={`${isAIChat ? 'lg:col-span-3' : 'lg:col-span-2'}`}> 
                    {InteractiveDemoComponent ? (
                        isAIChat ? (
                            <InteractiveDemoComponent projectTitle={project.title} projectDescription={project.fullDescription} />
                        ) : (
                            // Pass endpoint only if it exists
                            <InteractiveDemoComponent dataEndpoint={project.interactiveDemo?.dataEndpoint} />
                        )
                    ) : (
                        <img
                            src={project.imageUrl}
                            alt={`Screenshot of ${project.title}`}
                            className="w-full h-auto object-cover rounded-xl shadow-xl border border-gray-200 dark:border-gray-700"
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x600/0D1117/4ade80?text=Image+Error" }}
                        />
                    )}
                </div>

                {/* --- Right Column: Metadata / Links (Takes 1 col if not AI Chat) --- */}
                <div className={`${isAIChat ? 'hidden' : 'lg:col-span-1'} space-y-6`}> 
                    {/* Quick Links */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-3">
                        <h3 className="text-xl font-semibold mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100 flex items-center">
                            <Code className="w-5 h-5 mr-2 text-pcb-green" /> Resources
                        </h3>

                        {/* View Source Code Button */}
                        {project.repoUrl && (
                            <Button as="a" href={project.repoUrl} target="_blank" rel="noopener noreferrer" variant="secondary" className="w-full justify-center">
                                <GitBranch className="w-5 h-5 mr-2" /> View Source Code
                            </Button>
                        )}

                        {/* --- CONDITIONAL LIVE DEMO BUTTON --- */}
                        {(hasInteractiveDemo || project.liveUrl) ? (
                            hasInteractiveDemo ? (
                                // CASE 1: Interactive Demo Exists - Scroll Button
                                <Button onClick={handleScrollToDemo} variant="primary" className="w-full justify-center">
                                    <ExternalLink className="w-5 h-5 mr-2" /> View Interactive Demo
                                </Button>
                            ) : (
                                // CASE 2: External Link Exists - Link Button
                                <Button as="a" href={project.liveUrl} target="_blank" rel="noopener noreferrer" variant="primary" className="w-full justify-center">
                                    <ExternalLink className="w-5 h-5 mr-2" /> View Live Demo (External)
                                </Button>
                            )
                        ) : null }
                        {/* --- END CONDITIONAL BUTTON --- */}

                        {/* Talk to Project AI Button (remains the same) */}
                        {!isAIChat && (
                           <Button
                                variant="secondary"
                                className="w-full justify-center bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                onClick={handleScrollToDemo} // Scrolls to the demo section which might contain AI later
                           >
                                <MessageSquare className="w-5 h-5 mr-2" /> Talk to Project AI
                           </Button>
                        )}

                        {/* Fallback Message */}
                        {!project.repoUrl && !project.liveUrl && !hasInteractiveDemo && (
                           <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-2">No external links or interactive demo available.</p>
                        )}
                    </div>

                    {/* Tech Stack */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack?.map((tech, index) => ( // Safe check for techStack
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
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">Project Deep Dive</h2>

                {/* Full Markdown Description */}
                <article className="prose dark:prose-invert max-w-none mb-10">
                    <ReactMarkdown components={markdownComponents}>{project.fullDescription || "No detailed description provided."}</ReactMarkdown>
                </article>

                {/* Engineering Decisions */}
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
                        <div className="text-gray-500 dark:text-gray-400 p-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                            No explicit engineering decisions logged for this project yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;