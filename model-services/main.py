from GUI_Functions import show_graph, occupancy_graph, pallet_graph, run_optimization,calculate_occupancy_no_setup_time, calculate_utilization, find_minimal_pallet_amount, fitness_no_setup_time, selected_setup_time, calculate_occupancy, machine_utilization, product_flow
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import pandas as pd
from typing import Dict, Any
import json
import datetime
import tkinter as tk 
from tkinter import Toplevel

# Variables for def machine_util
input_list = None
process_steps = None
processing_times = None
product_paths = None
pallet_amount = None
setup_times_dict = None
best_solution_copy = None
pallets = None
best_pallet_config = None
val_list = None

app = FastAPI()

#This function retrieves all statistics and prints it out in the output box (It does the same thing as the machine occupancy graphs but skips plotting the graph)
def print_statistics_no_setup_time(input_list, best_solution, process_steps, processing_times, product_paths, best_solution_cleaned, tolerance_percent, best_fitness, pallet_amount):
    try:
        initial_occupancy = calculate_occupancy_no_setup_time(input_list, process_steps, processing_times, product_paths, pallet_amount)
        optimized_occupancy = calculate_occupancy_no_setup_time(best_solution, process_steps, processing_times, product_paths, pallet_amount)   
        
        initial_utilization, initial_total_time = calculate_utilization(initial_occupancy)
        optimized_utilization, optimized_total_time = calculate_utilization(optimized_occupancy)
        
        time_improvement = initial_total_time - optimized_total_time
        percentage_improvement = (time_improvement / initial_total_time) * 100
        
        avg_initial_utilization = sum(initial_utilization.values()) / len(initial_utilization)
        avg_optimized_utilization = sum(optimized_utilization.values()) / len(optimized_utilization)

        minimal_pallet_amount = find_minimal_pallet_amount(best_solution, best_fitness, tolerance_percent, setup_times_dict= None)
        pallet_fitness = fitness_no_setup_time([best_solution], minimal_pallet_amount, process_steps, processing_times, product_paths)

        # Prepare the data for JSON output
        result = {
            "initial_total_production_time": round(initial_total_time, 2),
            "optimized_total_production_time": round(optimized_total_time, 2),
            "time_improvement": round(time_improvement, 2),
            "percentage_improvement": round(percentage_improvement, 2),
            "average_initial_total_machine_utilization": round(avg_initial_utilization, 2),
            "average_optimized_total_machine_utilization": round(avg_optimized_utilization, 2),
            "utilization_improvement": round(avg_optimized_utilization - avg_initial_utilization, 2),
            "maximum_pallets_used": minimal_pallet_amount,
            "pallets_defined_in_Excel:": pallet_amount,
            "total_time_with_optimized_pallets": round(pallet_fitness[0][1], 2),
            "total_time_with_excel_pallets": best_fitness,
            "best_sequence_of_products": best_solution_cleaned
        }

        return json.dumps(result)

    except Exception as E:
        error_result = {
            "error": f"No optimization could be done for this sequence: {str(E)}"
        }
        return json.dumps(error_result)
    
def machine_util(window, output_screen, pallet_var):
    try: 
        now = datetime.now()  # Retrieve the current date and time
        title = now.strftime("%m/%d/%Y %H:%M")  # Format the date and time

        new_window = Toplevel(window)  # Create a new window
        new_window.title("Optimization Completed at " + title)  # Set the window title
        
        # Calculate machine occupancy values
        if selected_setup_time is not None:
            if pallet_var.get() == 1:
                initial_occupancy = calculate_occupancy(input_list, process_steps, processing_times, product_paths, pallet_amount, setup_times_dict)
                optimized_occupancy = calculate_occupancy(best_solution_copy, process_steps, processing_times, product_paths, pallets, setup_times_dict)
            else:
                initial_occupancy = calculate_occupancy(input_list, process_steps, processing_times, product_paths, pallet_amount, setup_times_dict)
                optimized_occupancy = calculate_occupancy(best_solution_copy, process_steps, processing_times, product_paths, pallet_amount, setup_times_dict)
        else:
            if pallet_var.get() == 1:
                initial_occupancy = calculate_occupancy_no_setup_time(input_list, process_steps, processing_times, product_paths, pallet_amount)
                optimized_occupancy = calculate_occupancy_no_setup_time(best_solution_copy, process_steps, processing_times, product_paths, pallets)
            else:
                initial_occupancy = calculate_occupancy_no_setup_time(input_list, process_steps, processing_times, product_paths, pallet_amount)
                optimized_occupancy = calculate_occupancy_no_setup_time(best_solution_copy, process_steps, processing_times, product_paths, pallet_amount)
        
        # Save all graphs
        fig1 = occupancy_graph(initial_occupancy, optimized_occupancy)
        fig2, utilization_results = machine_utilization(initial_occupancy, optimized_occupancy)
        fig3 = product_flow(best_solution_copy, product_paths, processing_times)

        fig_list = [fig1, fig2, fig3]
        current_index = [0]

        if pallet_var.get() == 1:
            fig4 = pallet_graph(best_pallet_config, val_list)
            fig_list.append(fig4)

    except Exception as E:
        output_screen.insert('end', f"\nCan't show graph because no optimization was done. {E}")
        output_screen.see(tk.END)

    # Export data as JSON
    def export_data_to_json(data, filename):
        try:
            with open(filename, 'w') as json_file:
                json.dump(data, json_file, indent=4)
            output_screen.insert('end', f"\nData successfully exported to {filename}")
        except Exception as e:
            output_screen.insert('end', f"\nFailed to export data: {e}")
        output_screen.see(tk.END)

    # Export functions for various data types
    def export_utilization_data():
        export_data_to_json(utilization_results, 'utilization_results.json')

    def export_occupancy_data():
        occupancy_data = {
            'initial_occupancy': initial_occupancy,
            'optimized_occupancy': optimized_occupancy
        }
        export_data_to_json(occupancy_data, 'occupancy_data.json')

    def export_pallet_data():
        export_data_to_json(best_pallet_config, 'pallet_config.json')

    # Define navigation buttons
    def buttons(current_index):
        nav_frame = tk.Frame(new_window)
        nav_frame.pack(
            side=tk.BOTTOM,
            fill=tk.X
        )
        
        prev_button = tk.Button(
            nav_frame,
            text="Previous",
            command=show_previous
        )
        prev_button.pack(
            side=tk.LEFT,
            padx=5,
            pady=5
        )

        next_button = tk.Button(
            nav_frame,
            text="Next",
            command=show_next
        )
        next_button.pack(
            side=tk.RIGHT,
            padx=5,
            pady=5
        )

        if current_index == 1:
            export_button = tk.Button(
                nav_frame,
                text='Export as JSON',
                command=export_utilization_data
            )
            export_button.pack(
                side=tk.LEFT,
                padx=5,
                pady=5
            )
        elif current_index == 0:
            export_util_button = tk.Button(
                nav_frame,
                text='Export as JSON',
                command=export_occupancy_data
            )
            export_util_button.pack(
                side=tk.LEFT,
                padx=5,
                pady=5
            )
        elif current_index == 3:
            export_util_button = tk.Button(
                nav_frame,
                text='Export as JSON',
                command=export_pallet_data
            )
            export_util_button.pack(
                side=tk.LEFT,
                padx=5,
                pady=5
            )

    # Show graphs and initialize buttons
    def show_next():
        current_index[0] = (current_index[0] + 1) % len(fig_list)
        show_graph(new_window, fig_list, current_index[0])
        buttons(current_index[0])

    def show_previous():
        current_index[0] = (current_index[0] - 1) % len(fig_list)
        show_graph(new_window, fig_list, current_index[0])
        buttons(current_index[0])

    show_graph(new_window, fig_list, current_index[0])
    buttons(current_index[0])


@app.post("/optimize")
async def optimize(file: UploadFile = File(...)) -> JSONResponse:
    """
    Endpoint to process the uploaded Excel file and return optimization results.
    """
    try:
        # Step 1: Read the uploaded Excel file into a DataFrame
        df = pd.read_excel(file.file)

        # Step 2: Run optimization logic
        optimized_data = run_optimization(df)

        # Step 3: Generate output
        stats = print_statistics_no_setup_time(optimized_data)
        utilization = machine_util(optimized_data)

        # Step 4: Create response
        response = {
            "statistics": stats,
            "machine_utilization": utilization
        }

        return JSONResponse(content=response)
    
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )